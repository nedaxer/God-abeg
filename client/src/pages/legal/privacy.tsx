import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, FileText, Calendar, Shield, Lock, Eye } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `This Privacy Policy describes how Nadex ("we," "us," or "our") collects, uses, shares, and protects personal information obtained from users ("you") of our website, mobile applications, and trading platforms (collectively, the "Services").

We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your information when you use our Services.

By accessing or using our Services, you agree to the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.`
    },
    {
      id: "information",
      title: "Information We Collect",
      content: `We collect several types of information from and about users of our Services, including:

Personal Information: Information that identifies you as an individual or relates to an identifiable person, such as name, postal address, telephone number, email address, date of birth, social security number, government-issued identification, financial information, and photographs or scans of identity documents.

Usage Information: Information about your connection to and use of our Services, including your IP address, device information, browser type, operating system, pages viewed, time spent on pages, links clicked, and other information about how you interact with our Services.

Location Information: Information about your general location, derived from your IP address or mobile device.

Transaction Information: Information about your trading activities, account balances, deposits, withdrawals, and other financial transactions conducted through our Services.

Communications: Records of communications between you and Nadex, including customer support inquiries, emails, and other correspondence.`
    },
    {
      id: "collection",
      title: "How We Collect Information",
      content: `We collect information from you in the following ways:

Directly from You: When you create an account, complete forms, participate in surveys, communicate with us, or otherwise interact with our Services.

Automatically: When you use our Services, we may automatically collect certain information about your device, browsing actions, and patterns using cookies, web beacons, and other similar technologies.

From Third Parties: We may receive information about you from third parties, such as identity verification services, credit reporting agencies, and public databases, to verify your identity, assess risk, and comply with regulatory requirements.`
    },
    {
      id: "use",
      title: "How We Use Your Information",
      content: `We use the information we collect for various purposes, including to:

Provide and Maintain our Services: Process transactions, maintain your account, and provide customer support.

Comply with Legal and Regulatory Requirements: Verify your identity, conduct required due diligence, fulfill our know-your-customer (KYC) and anti-money laundering (AML) obligations, and meet other regulatory requirements.

Improve and Develop our Services: Analyze usage patterns, conduct research, and develop new features and functionality.

Communicate with You: Send you transaction confirmations, account notifications, updates about our Services, and respond to your inquiries.

Protect our Services and Users: Detect, prevent, and address fraud, security breaches, and other potentially prohibited or illegal activities.

Marketing: With your consent where required by law, we may use your information to send you promotional communications about our products and services.`
    },
    {
      id: "sharing",
      title: "Information Sharing and Disclosure",
      content: `We may share your personal information with:

Service Providers: Third-party companies and individuals that provide services on our behalf, such as identity verification, payment processing, data analysis, email delivery, and customer service.

Regulatory Authorities: Government agencies, law enforcement, and regulatory bodies when required by law, regulation, or legal process.

Affiliated Companies: Companies that are under common control or ownership with Nadex.

Business Transfers: If Nadex is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be transferred as part of that transaction.

With Your Consent: We may share your information with third parties when you consent to such sharing.

We do not sell, rent, or lease your personal information to third parties for their marketing purposes without your explicit consent.`
    },
    {
      id: "security",
      title: "Data Security",
      content: `We implement appropriate technical and organizational safeguards designed to protect the security of any personal information we process. However, please understand that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.

Our security measures include:

Encryption: We use industry-standard encryption technologies to protect data in transit and at rest.

Access Controls: We restrict access to personal information to employees, contractors, and service providers who need to know that information to process it for us and who are subject to strict contractual confidentiality obligations.

Regular Audits: We conduct regular security assessments and audits to ensure the ongoing effectiveness of our security measures.

However, despite our efforts, no security system is impenetrable, and we cannot guarantee the security of our systems 100%. In the event that any information under our control is compromised as a result of a breach of security, we will take reasonable steps to investigate the situation and, where appropriate, notify those individuals whose information may have been compromised and take other steps in accordance with applicable laws and regulations.`
    },
    {
      id: "choices",
      title: "Your Choices and Rights",
      content: `Depending on your location, you may have certain rights regarding your personal information, which may include:

Access: You may have the right to request access to the personal information we hold about you.

Correction: You may have the right to request correction of your personal information if it is inaccurate or incomplete.

Deletion: You may have the right to request deletion of your personal information in certain circumstances.

Restriction: You may have the right to request restriction of processing of your personal information in certain circumstances.

Data Portability: You may have the right to receive your personal information in a structured, commonly used, and machine-readable format.

Objection: You may have the right to object to processing of your personal information in certain circumstances.

To exercise any of these rights, please contact us using the contact information provided at the end of this Privacy Policy. Please note that some of these rights may be limited where we have compelling legitimate grounds or legal obligations to continue to process your personal information.`
    },
    {
      id: "cookies",
      title: "Cookies and Similar Technologies",
      content: `We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our Services. Cookies are small text files that are stored on your device when you visit a website. We use cookies to enhance your experience, improve our Services, and for analytics and advertising purposes.

Types of cookies we use:

Strictly Necessary Cookies: These cookies are essential for the operation of our Services and enable you to navigate and use key features.

Analytical/Performance Cookies: These cookies allow us to recognize and count the number of visitors and see how visitors move around our Services. This helps us improve the way our Services work.

Functionality Cookies: These cookies enable us to personalize content and remember your preferences (e.g., your choice of language or region).

Targeting Cookies: These cookies record your visit to our Services, the pages you have visited, and the links you have followed. We may use this information to make our Services more relevant to your interests.

You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie preferences by adjusting your browser settings. You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies), you may not be able to access all or parts of our Services.`
    },
    {
      id: "children",
      title: "Children's Privacy",
      content: `Our Services are not directed to individuals under the age of 18, and we do not knowingly collect personal information from children under 18. If we learn that we have collected or received personal information from a child under 18 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 18, please contact us using the contact information provided at the end of this Privacy Policy.`
    },
    {
      id: "international",
      title: "International Data Transfers",
      content: `We are based in the United States, and the information we collect is governed by U.S. law. If you are accessing our Services from outside the United States, please be aware that information collected through our Services may be transferred to, processed, stored, and used in the United States and other jurisdictions. Your use of our Services or provision of any information therefore constitutes your consent to the transfer, processing, storage, and use of your information in the United States and other jurisdictions where data protection laws may be different and less protective than those in your country.

If we transfer personal information from the European Economic Area, United Kingdom, or Switzerland to a country that has not been found to provide an adequate level of protection under applicable data protection laws, we will implement appropriate safeguards to protect your personal information, which may include standard contractual clauses or other legal transfer mechanisms.`
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time to reflect changes to our information practices. We will post any changes on this page and, if the changes are significant, we will provide a more prominent notice. We encourage you to periodically review this Privacy Policy for the latest information on our privacy practices.

The date the Privacy Policy was last revised is identified at the top of the page. Your continued use of our Services after any changes to this Privacy Policy constitutes your acceptance of the revised Privacy Policy.`
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please use the contact form on our website.

Nedaxer Privacy Office
200 W Jackson Blvd, Suite 1400
Chicago, IL 60606`
    },
  ];

  return (
    <PageLayout 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your personal information"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last updated: March 1, 2025</span>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <Lock className="text-[#0033a0] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2 text-[#0033a0]">Your Privacy is Important to Us</h3>
                <p className="mb-0">
                  This Privacy Policy explains how we collect, use, and protect your personal information. 
                  We are committed to ensuring the confidentiality and security of your data in compliance 
                  with applicable privacy laws and regulations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-bold mb-4 text-[#0033a0]">Contents</h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`} 
                        className="text-[#0033a0] hover:text-[#ff5900] flex items-center"
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 space-y-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="#" className="flex items-center justify-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="/legal/terms">
                      Terms & Conditions
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="/legal/risk">
                      Risk Disclosure
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-8">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-8">
                    <h2 className="text-xl font-bold mb-4 text-[#0033a0]">{section.title}</h2>
                    <div className="prose prose-blue max-w-none">
                      {section.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.includes(':\n')) {
                          // Handle bullet points with titles
                          const [title, ...items] = paragraph.split('\n');
                          return (
                            <div key={i} className="mb-4">
                              <p className="font-bold">{title}</p>
                              <ul className="list-disc pl-5">
                                {items.map((item, j) => (
                                  <li key={j}>{item.trim()}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                        return <p key={i} className="mb-4">{paragraph}</p>;
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Our Commitment to Data Security</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center p-6 bg-[#f5f5f5] rounded-lg">
              <Shield className="h-12 w-12 text-[#0033a0] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Secure Infrastructure</h3>
              <p className="text-gray-700">
                Our systems are hosted in secure data centers with multiple layers of physical and network security.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-[#f5f5f5] rounded-lg">
              <Lock className="h-12 w-12 text-[#0033a0] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Encryption</h3>
              <p className="text-gray-700">
                We use industry-standard encryption to protect data in transit and at rest across all our services.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-[#f5f5f5] rounded-lg">
              <Eye className="h-12 w-12 text-[#0033a0] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Ongoing Monitoring</h3>
              <p className="text-gray-700">
                Our security team continuously monitors our systems to detect and respond to potential threats.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions about our Privacy Policy?</h2>
          <p className="mb-6">Our privacy team is available to address any questions or concerns you may have.</p>
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold"
          >
            <Link href="/company/contact">Contact Privacy Team</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}