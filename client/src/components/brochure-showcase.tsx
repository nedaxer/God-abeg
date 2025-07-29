import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, Building, Shield, Globe, Award, Users } from "lucide-react";

export const BrochureShowcase = () => {
  const handleDownloadBrochure = () => {
    const link = document.createElement('a');
    link.href = '/api/download/brochure';
    link.download = 'Nedaxer-Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-[#0033a0]">
              Learn More About Nedaxer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download our comprehensive brochure to discover why we're the trusted choice for 
              cryptocurrency investment and digital asset management worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Brochure features */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#0033a0]">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-[#0033a0] mr-3" />
                  <h3 className="text-xl font-bold text-[#0033a0]">Investment Strategies</h3>
                </div>
                <p className="text-gray-700">
                  Detailed information about our proven investment plans, from starter to VIP levels, 
                  with clear ROI expectations and risk management strategies.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#ff5900]">
                <div className="flex items-center mb-4">
                  <Building className="h-8 w-8 text-[#ff5900] mr-3" />
                  <h3 className="text-xl font-bold text-[#0033a0]">Company Background</h3>
                </div>
                <p className="text-gray-700">
                  Learn about Nedaxer's history, leadership team, regulatory compliance, 
                  and our commitment to transparency and client success.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#0033a0]">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-[#0033a0] mr-3" />
                  <h3 className="text-xl font-bold text-[#0033a0]">Security & Trust</h3>
                </div>
                <p className="text-gray-700">
                  Comprehensive overview of our security measures, insurance policies, 
                  and the robust infrastructure that protects your investments.
                </p>
              </div>
            </div>

            {/* Right side - Download CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-[#0033a0] to-[#ff5900] rounded-2xl p-8 text-white">
                <div className="mb-6">
                  <FileText className="h-20 w-20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Official Nedaxer Brochure</h3>
                  <p className="text-lg opacity-90">
                    Complete guide to our services and investment opportunities
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <Globe className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Global Reach</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <Award className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Proven Results</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Expert Team</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Growth Focus</p>
                  </div>
                </div>

                <Button
                  onClick={handleDownloadBrochure}
                  className="bg-white text-[#0033a0] hover:bg-gray-100 font-bold px-8 py-3 text-lg w-full"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Free Brochure
                </Button>
                
                <p className="text-sm mt-3 opacity-75">
                  PDF format • 35+ pages • Updated January 2025
                </p>
              </div>
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg p-8 shadow-md max-w-4xl mx-auto">
              <blockquote className="text-xl italic text-gray-700 mb-4">
                "We assist clients with multiple interactive services into the huge untapped 
                cryptocurrency market with a recipe for success. Our methods have been tried 
                and tested by major expert analysts and investment specialists."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="h-1 w-12 bg-[#0033a0] mr-3"></div>
                <p className="font-semibold text-[#0033a0]">Nedaxer Investment Team</p>
                <div className="h-1 w-12 bg-[#ff5900] ml-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};