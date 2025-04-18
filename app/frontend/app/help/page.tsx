import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ArrowLeft, MessageCircleQuestionIcon as QuestionMarkCircle, MessageSquare, Mail } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-col items-center mb-12">
          <Logo size="lg" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-center">Help & Support</h1>
          <p className="mt-4 text-xl text-muted-foreground text-center max-w-3xl">
            Find answers to common questions or contact our support team for assistance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <QuestionMarkCircle className="h-5 w-5 text-muted-foreground" />
                How do I register my business?
              </h3>
              <p className="text-muted-foreground">
                You can register your business by clicking on the "Register Your Business" button on our homepage.
                Follow the step-by-step process to create your business profile.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <QuestionMarkCircle className="h-5 w-5 text-muted-foreground" />
                Is IntelliBiz free to use?
              </h3>
              <p className="text-muted-foreground">
                Yes, IntelliBiz is free for customers to use. Business owners can create a basic listing for free, with
                premium features available for a monthly subscription.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <QuestionMarkCircle className="h-5 w-5 text-muted-foreground" />
                How do I update my business information?
              </h3>
              <p className="text-muted-foreground">
                Log in to your account, navigate to your business dashboard, and select "Edit Profile" to update your
                business information.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <QuestionMarkCircle className="h-5 w-5 text-muted-foreground" />
                How can I get verified status?
              </h3>
              <p className="text-muted-foreground">
                Verified status is granted to businesses that have completed our verification process. This includes
                providing business documentation and completing a brief review process.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Send us a Message</h3>
                <p className="text-muted-foreground mb-4">
                  Use our contact form to send us a message directly. We'll get back to you as soon as possible.
                </p>
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Send us an email at{" "}
                  <a href="mailto:support@intellibiz.com" className="text-primary hover:underline">
                    support@intellibiz.com
                  </a>{" "}
                  for assistance.
                </p>
                <p className="text-sm text-muted-foreground">We aim to respond to all inquiries within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
