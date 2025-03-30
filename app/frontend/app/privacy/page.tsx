import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-center">Privacy Policy</h1>
          <p className="mt-4 text-xl text-muted-foreground text-center max-w-3xl">Last updated: March 20, 2025</p>
        </div>

        <div className="max-w-4xl mx-auto prose prose-slate">
          <h2>1. Introduction</h2>
          <p>
            At IntelliBiz, we respect your privacy and are committed to protecting your personal data. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you use our website,
            mobile application, and services (collectively, the "Service").
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
            do not access the Service.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Data</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you register for the Service,
            express an interest in obtaining information about us or our products and services, participate in
            activities on the Service, or otherwise contact us. The personal information we collect may include:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Address</li>
            <li>Business information (for Business Owners)</li>
            <li>Payment information</li>
            <li>Profile information (such as profile pictures, preferences, etc.)</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you access or use our Service, we may automatically collect certain information, including:</p>
          <ul>
            <li>Device information (such as your IP address, browser type, operating system, etc.)</li>
            <li>Usage information (such as pages visited, time spent on the Service, etc.)</li>
            <li>Location information (with your consent)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing, maintaining, and improving the Service</li>
            <li>Processing transactions and sending related information</li>
            <li>Responding to your inquiries and providing customer support</li>
            <li>Sending administrative information, such as updates to our terms, conditions, and policies</li>
            <li>Sending marketing and promotional communications (with your consent)</li>
            <li>Personalizing your experience on the Service</li>
            <li>Monitoring and analyzing usage and trends</li>
            <li>Detecting, preventing, and addressing technical issues</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We may share your information in the following situations:</p>
          <ul>
            <li>
              <strong>With Service Providers:</strong> We may share your information with third-party vendors, service
              providers, contractors, or agents who perform services for us or on our behalf.
            </li>
            <li>
              <strong>With Business Partners:</strong> We may share your information with our business partners to offer
              you certain products, services, or promotions.
            </li>
            <li>
              <strong>With Other Users:</strong> When you share personal information or interact with public areas of
              the Service, such information may be viewed by all users and may be publicly distributed.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with
              your consent.
            </li>
            <li>
              <strong>For Business Transfers:</strong> We may share or transfer your information in connection with, or
              during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion
              of our business to another company.
            </li>
            <li>
              <strong>For Legal Purposes:</strong> We may disclose your information where required to do so by law or in
              response to valid requests by public authorities.
            </li>
          </ul>

          <h2>5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Service and store certain
            information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
            you do not accept cookies, you may not be able to use some portions of our Service.
          </p>
          <p>We use the following types of cookies:</p>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> These cookies are necessary for the Service to function properly.
            </li>
            <li>
              <strong>Preference Cookies:</strong> These cookies remember your preferences and settings.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> These cookies help us understand how users interact with the Service.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> These cookies track your activity to deliver targeted advertising.
            </li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the
            security of any personal information we process. However, please also remember that we cannot guarantee that
            the internet itself is 100% secure.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this
            Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p>
            When we have no ongoing legitimate business need to process your personal information, we will either delete
            or anonymize it, or, if this is not possible, then we will securely store your personal information and
            isolate it from any further processing until deletion is possible.
          </p>

          <h2>8. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
          <ul>
            <li>The right to access the personal information we have about you</li>
            <li>The right to request that we correct or update your personal information</li>
            <li>The right to request that we delete your personal information</li>
            <li>The right to object to processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>To exercise these rights, please contact us using the contact information provided below.</p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our Service is not directed to children under the age of 13, and we do not knowingly collect personal
            information from children under 13. If we learn that we have collected personal information from a child
            under 13, we will promptly delete that information.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@intellibiz.com" className="text-primary hover:underline">
              privacy@intellibiz.com
            </a>
            .
          </p>
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

