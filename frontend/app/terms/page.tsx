import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-center">Terms of Service</h1>
          <p className="mt-4 text-xl text-muted-foreground text-center max-w-3xl">Last updated: March 20, 2025</p>
        </div>

        <div className="max-w-4xl mx-auto prose prose-slate">
          <h2>1. Introduction</h2>
          <p>
            Welcome to IntelliBiz. These Terms of Service ("Terms") govern your use of the IntelliBiz website, mobile
            applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be
            bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
          </p>

          <h2>2. Definitions</h2>
          <p>
            <strong>"User"</strong> refers to any individual who accesses or uses the Service, including both Business
            Owners and Customers.
          </p>
          <p>
            <strong>"Business Owner"</strong> refers to any User who registers a business on the Service.
          </p>
          <p>
            <strong>"Customer"</strong> refers to any User who uses the Service to find, contact, or engage with
            businesses listed on the Service.
          </p>
          <p>
            <strong>"Content"</strong> refers to any information, text, graphics, photos, or other materials uploaded,
            downloaded, or appearing on the Service.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you may be required to register for an account. You must provide
            accurate, current, and complete information during the registration process and keep your account
            information up-to-date.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities
            or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination
            of upper and lower case letters, numbers, and symbols) with your account.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming
            aware of any breach of security or unauthorized use of your account.
          </p>

          <h2>4. Business Listings</h2>
          <p>
            Business Owners may create listings for their businesses on the Service. By creating a listing, Business
            Owners represent and warrant that all information provided is accurate, complete, and up-to-date.
          </p>
          <p>
            Business Owners are solely responsible for the Content they provide in their listings, including but not
            limited to business descriptions, contact information, service offerings, pricing, and images.
          </p>
          <p>
            IntelliBiz reserves the right to remove any listing that violates these Terms or for any other reason at our
            sole discretion.
          </p>

          <h2>5. User Content</h2>
          <p>
            Users may post, upload, or otherwise contribute Content to the Service. By contributing Content, you grant
            IntelliBiz a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, modify,
            publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
          </p>
          <p>
            You represent and warrant that you own or have the necessary rights to post the Content you contribute to
            the Service, and that your Content does not violate the rights of any third party, including intellectual
            property rights and privacy rights.
          </p>
          <p>
            IntelliBiz reserves the right to remove any Content that violates these Terms or for any other reason at our
            sole discretion.
          </p>

          <h2>6. Prohibited Activities</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul>
            <li>
              Using the Service for any illegal purpose or in violation of any local, state, national, or international
              law
            </li>
            <li>Harassing, threatening, or intimidating other Users</li>
            <li>Posting false, misleading, or deceptive Content</li>
            <li>Impersonating another person or entity</li>
            <li>Interfering with or disrupting the Service or servers or networks connected to the Service</li>
            <li>
              Attempting to gain unauthorized access to parts of the Service, other accounts, or computer systems or
              networks connected to the Service
            </li>
            <li>
              Using the Service to send unsolicited communications, promotions, or advertisements, or to spam, phish, or
              pharm other Users
            </li>
            <li>Collecting or harvesting any personally identifiable information from the Service</li>
            <li>Using the Service for any commercial purpose other than as expressly permitted by these Terms</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by Users), features, and functionality are
            and will remain the exclusive property of IntelliBiz and its licensors. The Service is protected by
            copyright, trademark, and other laws of both the United States and foreign countries.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with any product or service without the prior
            written consent of IntelliBiz.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall IntelliBiz, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access
            to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on
            the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration
            of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any
            other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>

          <h2>9. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
            basis. The Service is provided without warranties of any kind, whether express or implied, including, but
            not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement,
            or course of performance.
          </p>
          <p>
            IntelliBiz does not warrant that (i) the Service will function uninterrupted, secure, or available at any
            particular time or location; (ii) any errors or defects will be corrected; (iii) the Service is free of
            viruses or other harmful components; or (iv) the results of using the Service will meet your requirements.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard
            to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
            rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
            provisions of these Terms will remain in effect.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a
            material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:legal@intellibiz.com" className="text-primary hover:underline">
              legal@intellibiz.com
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

