import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signup">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign Up
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Globalist Media Suite is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service, including our website and mobile application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We may collect personal information that you voluntarily provide, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Profile information and preferences</li>
                    <li>Payment and billing information</li>
                    <li>Communications with us</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    We automatically collect certain information about your use of our Service:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage patterns and preferences</li>
                    <li>Log files and analytics data</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Providing, maintaining, and improving our Service</li>
                  <li>Processing transactions and managing your account</li>
                  <li>Communicating with you about your account and our services</li>
                  <li>Personalizing your experience and content recommendations</li>
                  <li>Analyzing usage patterns to improve our Service</li>
                  <li>Detecting, preventing, and addressing technical issues and security threats</li>
                  <li>Complying with legal obligations and enforcing our terms</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>With your explicit consent</li>
                  <li>With service providers who assist us in operating our Service</li>
                  <li>To comply with legal obligations or respond to lawful requests</li>
                  <li>To protect our rights, property, or safety, or that of our users</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Access: Request a copy of the personal information we hold about you</li>
                  <li>Correction: Request correction of inaccurate or incomplete information</li>
                  <li>Deletion: Request deletion of your personal information</li>
                  <li>Portability: Request transfer of your information to another service</li>
                  <li>Objection: Object to certain processing of your information</li>
                  <li>Restriction: Request restriction of processing in certain circumstances</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences, though disabling cookies may affect the functionality of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to these external services, and we encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the Last updated date. Your continued use of our Service after such changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">Globalist Media Suite - Privacy Team</p>
                  <p className="text-muted-foreground">Email: privacy@globalistmedia.com</p>
                  <p className="text-muted-foreground">Address: [Your Company Address]</p>
                  <p className="text-muted-foreground">Phone: [Your Contact Number]</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Regional Specific Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">For EU/EEA Residents (GDPR)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Under the General Data Protection Regulation (GDPR), you have additional rights including the right to lodge a complaint with a supervisory authority. Our lawful basis for processing your personal information includes consent, contract performance, legitimate interests, and legal compliance.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">For California Residents (CCPA)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their personal information, including the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of the sale of personal information.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}