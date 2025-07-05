import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, FileText, Scale, DollarSign, AlertCircle } from "lucide-react";

export default function Regulations() {
  const regulatoryFramework = [
    {
      title: "CFTC Regulation",
      description: "The Commodity Futures Trading Commission (CFTC) is the primary regulator of derivatives markets in the United States, overseeing exchanges like Nedaxer to ensure market integrity and customer protection.",
      icon: <Shield className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Designated Contract Market (DCM)",
      description: "Nedaxer is registered as a Designated Contract Market (DCM), which allows us to offer regulated derivative products to retail traders in the United States.",
      icon: <FileText className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Anti-Money Laundering (AML)",
      description: "Nedaxer implements robust AML procedures including identity verification, transaction monitoring, and suspicious activity reporting to prevent financial crimes.",
      icon: <Scale className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Segregated Funds",
      description: "Member funds are held in segregated accounts at top-tier US banks, separate from Nedaxer's operating funds, providing an additional layer of protection.",
      icon: <DollarSign className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const complianceDocuments = [
    {
      title: "Exchange Rules",
      description: "The comprehensive rulebook governing all trading activities, member conduct, and dispute resolution on Nedaxer.",
      link: "#",
    },
    {
      title: "Risk Disclosure Statement",
      description: "Important information about the risks associated with trading derivative products on Nedaxer.",
      link: "#",
    },
    {
      title: "Membership Agreement",
      description: "The legal agreement between Nedaxer and its members outlining rights, responsibilities, and terms of service.",
      link: "#",
    },
    {
      title: "Privacy Policy",
      description: "Details on how Nedaxer collects, uses, and protects your personal information.",
      link: "#",
    },
    {
      title: "AML Policy Statement",
      description: "Nedaxer's policies and procedures for preventing money laundering and terrorist financing.",
      link: "#",
    },
  ];

  return (
    <PageLayout 
      title="Regulations" 
      subtitle="Trading on a secure, regulated US exchange with robust customer protections"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Regulatory Oversight</h2>
          
          <div className="mb-8">
            <p className="mb-4">
              Nedaxer operates under the regulatory oversight of the U.S. Commodity Futures Trading Commission (CFTC), 
              which ensures our exchange maintains the highest standards of market integrity, transparency, and 
              customer protection.
            </p>
            <p className="mb-4">
              As a regulated exchange, Nedaxer must comply with strict financial requirements, reporting obligations, 
              and operating procedures designed to protect market participants and maintain a fair trading environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {regulatoryFramework.map((item, i) => (
              <div key={i} className="flex items-start p-6 bg-[#f5f5f5] rounded-lg">
                <div className="mr-4">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Customer Protection</h2>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Segregated Funds</h3>
            <p className="mb-4">
              One of the most important customer protections at Nedaxer is the segregation of member funds. 
              This means your money is held in dedicated accounts at top-tier US banks, completely separate 
              from Nedaxer's operating funds.
            </p>
            <p className="mb-4">
              This segregation provides a critical layer of protection, ensuring your funds are used only 
              for your trading activities and are not exposed to the business risks of the exchange.
            </p>
            <p>
              Nedaxer maintains detailed records of all member funds and undergoes regular audits to ensure 
              compliance with regulatory requirements for fund segregation.
            </p>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Limited Risk Products</h3>
            <p className="mb-4">
              All products offered on Nedaxer are designed with limited risk characteristics. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your maximum possible loss is known before you enter a trade</li>
              <li>You can never lose more than the capital you commit to each trade</li>
              <li>There are no margin calls</li>
              <li>Your risk is limited to your initial cost or collateral</li>
            </ul>
            <p>
              This built-in risk limitation is a fundamental customer protection that distinguishes 
              Nedaxer from many other trading venues.
            </p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Compliance Documents</h2>
          
          <p className="mb-6">
            The following documents outline Nedaxer's regulatory framework, operating procedures, 
            and policies to ensure compliance with applicable laws and regulations:
          </p>
          
          <div className="space-y-4">
            {complianceDocuments.map((doc, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{doc.title}</h3>
                <p className="text-gray-700 mb-3">{doc.description}</p>
                <Link 
                  href={doc.link} 
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  View Document <FileText className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Regulatory Notices</h2>
          
          <div className="border border-yellow-400 bg-yellow-50 p-6 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertCircle className="text-yellow-600 mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-yellow-800">CFTC Rule 4.41 - Hypothetical Performance Disclaimer</h3>
                <p className="text-yellow-700">
                  HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS, SOME OF WHICH ARE DESCRIBED BELOW. 
                  NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR 
                  TO THOSE SHOWN. IN FACT, THERE ARE FREQUENTLY SHARP DIFFERENCES BETWEEN HYPOTHETICAL PERFORMANCE RESULTS 
                  AND THE ACTUAL RESULTS SUBSEQUENTLY ACHIEVED BY ANY PARTICULAR TRADING PROGRAM.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="text-gray-600 mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-gray-800">Risk Disclosure</h3>
                <p className="text-gray-700 mb-2">
                  Trading on Nedaxer involves financial risk and may not be appropriate for all investors. 
                  The value of your investments can go down as well as up, and you may lose some or all of your investment. 
                  Past performance is not indicative of future results.
                </p>
                <Link 
                  href="/legal/risk" 
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  View Full Risk Disclosure <FileText className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8">
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold mb-2">Questions about our regulatory framework?</h2>
              <p>Our compliance team is available to address any questions or concerns.</p>
            </div>
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3 whitespace-nowrap"
            >
              <Link href="/company/contact">Contact Compliance</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}