import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
})

// Enhanced website information for the AI to reference
const websiteInfo = {
  name: "IntelliBiz",
  description: "A platform connecting local businesses with customers in their community",
  founded: "2023",
  services: [
    "Business listings and profiles",
    "Customer reviews and ratings",
    "Appointment booking",
    "Business registration",
    "Messaging between customers and businesses",
    "Search and discovery of local services",
  ],
  businessHours:
    "Our platform is available 24/7. Customer support is available Monday to Friday, 9:00 AM to 5:00 PM EST.",
  contactInfo: {
    email: "info@intellibiz.com",
    phone: "(555) 123-4567",
    address: "123 Business Avenue, Suite 456, New York, NY 10001",
  },
  businessCategories: [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Cleaning",
    "Landscaping",
    "Automotive",
    "Beauty & Wellness",
    "Food & Catering",
    "Education & Tutoring",
    "IT & Technology",
    "Healthcare",
    "Legal Services",
    "Financial Services",
  ],
  businessRegistration: {
    process:
      "Business owners can register by clicking the 'Register Your Business' button on the homepage and following the step-by-step form.",
    requirements:
      "Business name, category, description, contact information, location, business hours, and services offered.",
    verification:
      "Businesses can apply for verified status by providing business documentation and completing a review process.",
  },
  searchFeatures: {
    byCategory: "Users can search for businesses by category (e.g., plumbing, electrical)",
    byLocation: "Users can find businesses near them based on location",
    byRating: "Users can filter businesses by rating to find the best-rated services",
    byVerification: "Users can filter to see only verified businesses",
  },
  commonQueries: {
    "Find a plumber": "When users ask to find a plumber, show them plumbing businesses sorted by rating",
    "Best electrician": "When users ask for the best electrician, show electrical businesses sorted by highest rating",
    "Businesses near me": "When users ask for businesses near them, prioritize businesses in Manhattan and Brooklyn",
    "New businesses": "When users ask about new businesses, show businesses registered within the last 3 months",
  },
}

export async function POST(req: Request) {
  try {
    // Get the IP address for rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
    
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
          limit,
          reset,
          remaining,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      )
    }

    const { messages } = await req.json()

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Create an enhanced system prompt that includes detailed information about the website
    const systemPrompt = `
You are IntelliBiz AI, a helpful assistant for the IntelliBiz platform.

ABOUT INTELLIBIZ:
${websiteInfo.description}
- Founded in ${websiteInfo.founded}
- Services offered: ${websiteInfo.services.join(", ")}
- Business hours: ${websiteInfo.businessHours}
- Contact: ${websiteInfo.contactInfo.email}, ${websiteInfo.contactInfo.phone}
- Address: ${websiteInfo.contactInfo.address}
- Business categories: ${websiteInfo.businessCategories.join(", ")}

BUSINESS REGISTRATION:
- Process: ${websiteInfo.businessRegistration.process}
- Requirements: ${websiteInfo.businessRegistration.requirements}
- Verification: ${websiteInfo.businessRegistration.verification}

SEARCH FEATURES:
- Category search: ${websiteInfo.searchFeatures.byCategory}
- Location search: ${websiteInfo.searchFeatures.byLocation}
- Rating filters: ${websiteInfo.searchFeatures.byRating}
- Verification filters: ${websiteInfo.searchFeatures.byVerification}

YOUR ROLE:
1. Help users find local businesses based on their specific needs
2. Answer questions about IntelliBiz services and features
3. Provide guidance on using the platform
4. Assist with business registration and account management
5. Offer general information about local services

RESPONSE GUIDELINES:
- Be conversational, helpful, and concise
- When users ask about finding businesses, respond with "Here are some businesses that might help with your request:"
- For queries about "best" businesses, mention you're showing the highest-rated options
- For queries about "near me", explain you're showing businesses in the user's area
- For queries about "new" or "newly registered" businesses, mention you're showing recently added businesses
- For specific service needs (like "tap repair"), mention you're showing businesses that specialize in that service
- Format business recommendations as a list with bullet points
- Include relevant business details like rating, location, and services offered
- Always provide a call-to-action (e.g., "Click here to view more details" or "Would you like me to help you book an appointment?")

SPECIAL QUERY HANDLING:
- "Find me the best plumber for my tap" - Respond about showing top-rated plumbers specializing in tap repairs
- "Show newly registered plumbers" - Respond about showing plumbers that joined the platform in the last 3 months
- "Find a plumber near me" - Respond about showing plumbers in the user's local area

Always provide helpful, accurate information and guide users to the appropriate businesses or features on the IntelliBiz platform.
`

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to process your request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
