import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, FileText, Calendar } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `These Terms and Conditions (the "Terms") govern your access to and use of Nedaxer's website, mobile applications, and trading platforms (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.

Nedaxer is a regulated exchange under the oversight of the U.S. Commodity Futures Trading Commission (CFTC). All trading activities conducted through our platforms are subject to applicable regulations and exchange rules.`
    },
    {
      id: "eligibility",
      title: "Eligibility",
      content: `To be eligible to use our Services, you must be at least 18 years old and reside in a jurisdiction where access to and use of our Services is legal. By accessing or using our Services, you represent and warrant that you meet these eligibility requirements.

Certain aspects of our Services may not be available to persons located in certain jurisdictions due to regulatory restrictions. Nedaxer reserves the right to limit access to its Services based on geographic location or other criteria at its sole discretion.`
    },
    {
      id: "account",
      title: "Account Registration and Security",
      content: `To use certain features of our Services, you must register for an account. When registering, you agree to provide accurate, current, and complete information about yourself. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

You agree to immediately notify Nedaxer of any unauthorized use of your account or any other breach of security. Nedaxer will not be liable for any losses or damages arising from your failure to comply with this section.`
    },
    {
      id: "trading",
      title: "Trading Terms",
      content: `All trades conducted on Nedaxer platforms are governed by the Nedaxer Exchange Rules, which are incorporated into these Terms by reference. You agree to abide by these rules when trading on Nedaxer.

You acknowledge that trading derivative products involves significant risk of loss and is not suitable for all investors. You should carefully consider whether trading is appropriate for you in light of your financial circumstances, objectives, experience, and risk tolerance.

All deposit and withdrawal transactions are subject to the terms outlined in our Funding Policies, which are incorporated into these Terms by reference.`
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      content: `All content, features, and functionality available through our Services, including but not limited to text, graphics, logos, icons, images, audio clips, data compilations, and software, are the exclusive property of Nedaxer or its licensors and are protected by United States and international copyright, trademark, patent, and other intellectual property or proprietary rights laws.

You are granted a limited, non-exclusive, non-transferable, and revocable license to access and use our Services for their intended purposes. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services without our express prior written consent.`
    },
    {
      id: "prohibited",
      title: "Prohibited Activities",
      content: `You agree not to engage in any of the following prohibited activities:
- Violating any applicable laws, regulations, or the Nedaxer Exchange Rules
- Impersonating another person or entity
- Attempting to gain unauthorized access to any portion of the Services or any other systems or networks connected to the Services
- Using any automated means, including bots, spiders, or scrapers, to access or collect data from our Services
- Engaging in market manipulation or other deceptive trading practices
- Uploading viruses, malware, or other malicious code
- Interfering with or disrupting the integrity or performance of the Services

Nedaxer reserves the right to terminate your access to the Services for any violation of these prohibited activities.`
    },
    {
      id: "disclaimer",
      title: "Disclaimers and Limitation of Liability",
      content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, NEDAXER DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

IN NO EVENT WILL NEDAXER, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.`
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content: `You agree to defend, indemnify, and hold harmless Nedaxer, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Services.`
    },
    {
      id: "modifications",
      title: "Modifications to the Terms",
      content: `Nedaxer reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting the updated Terms on our website. Your continued use of the Services after any changes to the Terms constitutes your acceptance of the revised Terms.

It is your responsibility to review these Terms periodically to stay informed of updates. If you do not agree with the revised Terms, you must stop using the Services.`
    },
    {
      id: "termination",
      title: "Termination",
      content: `Nedaxer may terminate or suspend your access to all or part of the Services, with or without notice, for any conduct that Nedaxer, in its sole discretion, believes violates these Terms or is harmful to other users of the Services, Nedaxer, or third parties, or for any other reason.

Upon termination, your right to use the Services will immediately cease, and you must cease all use of the Services. Any provision of these Terms that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`
    },
    {
      id: "governing",
      title: "Governing Law and Dispute Resolution",
      content: `These Terms and any disputes arising out of or related to these Terms or the Services shall be governed by and construed in accordance with the laws of the State of Illinois, without regard to its conflict of law principles.

Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Services shall be instituted exclusively in the federal courts of the United States or the courts of the State of Illinois, in each case located in Chicago, Illinois, although Nedaxer retains the right to bring any suit, action, or proceeding against you for breach of these Terms in your country of residence or any other relevant jurisdiction.`
    },
    {
      id: "miscellaneous",
      title: "Miscellaneous",
      content: `These Terms, including any legal notices and disclaimers contained on our website, constitute the entire agreement between you and Nedaxer regarding your use of the Services and supersede all prior and contemporaneous agreements, proposals, or representations, written or oral, concerning the subject matter.

If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the remaining provisions will remain in full force and effect.

No waiver by Nedaxer of any term or condition set out in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Nedaxer to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.`
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `If you have any questions about these Terms, please contact us at:

Nedaxer
200 W Jackson Blvd, Suite 1400
Chicago, IL 60606
Email: compliance@nedaxer.com
Phone: +1 (888) 555-7777`
    },
  ];

  return (
    <PageLayout 
      title="Terms & Conditions" 
      subtitle="Please read these terms carefully before using our services"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last updated: March 15, 2025</span>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <p className="mb-4">
              These Terms and Conditions govern your access to and use of Nedaxer's website, mobile applications, 
              and trading platforms. By using our services, you agree to be bound by these terms.
            </p>
            
            <p className="font-bold">
              This document contains important information about your rights and obligations, as well as 
              limitations and exclusions that may apply to you. Please read it carefully.
            </p>
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
                    <Link href="/legal/privacy">
                      Privacy Policy
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
                        if (paragraph.startsWith('-')) {
                          // Handle bullet points
                          const bulletPoints = paragraph.split('\n');
                          return (
                            <ul key={i} className="list-disc pl-5 mb-4">
                              {bulletPoints.map((point, j) => (
                                <li key={j}>{point.replace('-', '').trim()}</li>
                              ))}
                            </ul>
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

        <div className="bg-[#f5f5f5] rounded-lg p-8 text-center mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#0033a0]">Questions about our Terms & Conditions?</h2>
          <p className="mb-6">Contact our compliance team for clarification or assistance.</p>
          <Button
            asChild
            className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold"
          >
            <Link href="/company/contact">Contact Compliance Team</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}