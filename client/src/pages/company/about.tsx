import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Building, Users, GraduationCap, Shield, Download, FileText, TrendingUp, Globe, Award, Zap, Star, DollarSign, BarChart3, Coins, Home, PieChart, Briefcase } from "lucide-react";

export default function About() {
  const handleDownloadBrochure = () => {
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = '/downloads/nedaxer-brochure.pdf';
    link.download = 'Nedaxer-Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageLayout
      title="About Nedaxer - Leading Global Asset Management"
      description="Nedaxer is a prestigious cryptocurrency and asset management company established in 2012, providing comprehensive investment services across multiple sectors including cryptocurrency trading, real estate, private equity, and credit management."
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Creating a Promising Future
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-orange-100">
                  Leading Global Manager of Alternative Investments
                </p>
                <p className="text-lg md:text-xl text-orange-100 mb-8">
                  Building bridges between traditional finance and cryptocurrency since 2012, 
                  democratizing access to digital wealth with proven investment strategies.
                </p>
                <div className="flex justify-start">
                  <Button 
                    onClick={handleDownloadBrochure}
                    className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Investment Brochure
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src="/assets/nedaxer-future-city.png" 
                  alt="Nedaxer - Creating a Promising Future" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src="/assets/nedaxer-welcome.png" 
                  alt="Welcome to the Future" 
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Welcome to the Future
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Since our founding, Nedaxer has thrived because of the trust we have earned from our stakeholders. 
                  As we continue to grow and expand, we remain committed to building upon that trust as we apply our proven and disciplined 
                  investment approach across asset classes and geographies as a uniquely global firm.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  With an entrepreneurial spirit and prudent institutional practices, Nedaxer prioritizes our relationships 
                  and driving sustainable value for those that we are privileged to serve.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Mission & Overview */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Why Nedaxer?
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We assist clients with multiple interactive services into the huge untapped cryptocurrency market with a recipe for success. 
                  Our methods have been tried and tested by major expert analysts and investment specialists, proving our successful formula.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  With professional background credibility, we are here to ensure that your financial present and future are on the path to success. 
                  Nedaxer is a cryptocurrency and prestigious digital asset management company established with the vision of democratizing access to digital wealth.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Nedaxer Investment's pride is investing on behalf of our clients — from large institutions to parents and grandparents, 
                  teachers, nurses, doctors and everyone who entrust their funds to us.
                </p>
                <p className="text-lg text-gray-600">
                  We are responsible for the support, marketing, customer and partner communication. 
                  Headquarters also coordinates the opening of new countries throughout the world.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Global Reach</h3>
                    <p className="text-sm text-gray-600">Worldwide Operations</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Proven Track Record</h3>
                    <p className="text-sm text-gray-600">Since 2012</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Secure & Reliable</h3>
                    <p className="text-sm text-gray-600">Canada Registered</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Expert Approved</h3>
                    <p className="text-sm text-gray-600">Analyst Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What We Do
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We provide comprehensive asset management services across multiple sectors with proven track records
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cryptocurrency
                </h3>
                <p className="text-gray-600">
                  Our whales and traders have held over US $7bn cryptocurrencies over the past years from inception in 2012.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real Estate
                </h3>
                <p className="text-gray-600">
                  Since inception in 2012, our global real estate investments have totaled over US $23bn across approximately 1,100 properties in the US, Europe & India.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Private Equity
                </h3>
                <p className="text-gray-600">
                  Our PE teams operate across North America, Europe, India, Asia, and the MENA region, with a special team focusing on technology.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Credit Management
                </h3>
                <p className="text-gray-600">
                  With a 15-year track record of success and approximately $14.7bn in AUM, our CM continues to grow thanks to a global sourcing platform.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Strategic Capital
                </h3>
                <p className="text-gray-600">
                  Our Strategic Capital group focuses on acquiring minority interests in alternative asset managers with strong track records, exceptional teams, and attractive growth prospects.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Infrastructure
                </h3>
                <p className="text-gray-600">
                  A joint venture with Itarle market investments, our infrastructure investments focus on benefiting from Acron's extensive private equity expertise and market knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Invest With Us */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Invest With Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We ensure that investing is stress free and easy with proven investment structures
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Simple
                </h3>
                <p className="text-gray-600">
                  We ensure that investing is stress free and easy. You don't have to pass through difficulties like finding the right investment brand or worrying about how fast your money will grow.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Robust
                </h3>
                <p className="text-gray-600">
                  Imagine waking every morning knowing your money is multiplying somewhere. With our laid down investment structures, we ensure that our clients always get their return on investments in the stated and agreed time.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Secure
                </h3>
                <p className="text-gray-600">
                  Honesty and transparency is key for us at Nedaxer Investment Company. We are fully registered with the Canada Business Corporations Act as a legal and trusted business entity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Plans Preview */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nedaxer Investment Plans
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Nedaxer offers 2 Standard, 1 fixed deposit plan, 1 NFP trade, Pattern Day trading and 3 Day trading crypto investment briefcases
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  NFP TRADES
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Non-Farm Payroll Trading
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Minimum Investment:</strong> $2,000</p>
                  <p><strong>Maximum Investment:</strong> $30,000</p>
                  <p><strong>ROI Model:</strong> 25% after 24 hours</p>
                  <p><strong>Referral Commission:</strong> 10% on first deposit</p>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>• NFP trade has duration investment plan of three months</p>
                  <p>• NFP trade investment profit reflects on user's dashboard after 24hrs</p>
                  <p>• Any investor can participate on the NFP Trade irrespective of existing plan</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  FIXED DEPOSIT
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Fixed Deposit Plan
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Minimum Investment:</strong> $500</p>
                  <p><strong>Maximum Investment:</strong> Unlimited</p>
                  <p><strong>ROI Model:</strong> 16% biweekly</p>
                  <p><strong>Referral Commission:</strong> 10% on first deposit</p>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>• The interest you earn is either paid at maturity or on periodic basis depending on the companies setup</p>
                  <p>• You are not allowed to withdraw the fund before the maturity</p>
                  <p>• Accessible for investment at any given time</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  PATTERN DAY TRADING
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Pattern Day Trading
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Advanced Strategies:</strong> Professional trading</p>
                  <p><strong>Market Analysis:</strong> Real-time insights</p>
                  <p><strong>Risk Management:</strong> Controlled exposure</p>
                  <p><strong>Expert Support:</strong> Dedicated team</p>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>• For experienced traders seeking enhanced returns</p>
                  <p>• 3 Day trading crypto investment briefcases available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Team */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Who is Behind Nedaxer
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet our experienced leadership team dedicated to delivering exceptional investment solutions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* CEO */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg shadow-lg">
                <div className="text-center">
                  <img 
                    src="/assets/ceo-aravanis-profile.png" 
                    alt="ARAVANIS, Panagiotis - CEO" 
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    ARAVANIS, Panagiotis
                  </h3>
                  <p className="text-blue-600 font-semibold mb-4">
                    Chief Executive Officer
                  </p>
                  <blockquote className="text-orange-600 italic mb-4 text-sm">
                    "Whether it's learning a new personal skill or helping your client grow their brand awareness, the reasoning behind the growth always has a greater goal in mind."
                  </blockquote>
                  <p className="text-gray-600 text-sm">
                    Over 18 years of experience in corporate finance and public accounting. Expertise in planning and organizing projects and supervising traders while simultaneously overseeing multiple assignments.
                  </p>
                </div>
              </div>

              {/* Director of Finance */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg shadow-lg">
                <div className="text-center">
                  <img 
                    src="/assets/finance-director-brandon-profile.jpg" 
                    alt="Brandon Freisen - Director of Finance" 
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-green-200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Brandon Freisen
                  </h3>
                  <p className="text-green-600 font-semibold mb-4">
                    Director of Finance
                  </p>
                  <blockquote className="text-orange-600 italic mb-4 text-sm">
                    "Growth for me means ensuring people are in a position to succeed."
                  </blockquote>
                  <p className="text-gray-600 text-sm">
                    A leader in the media industry with over 20 years' experience delivering business growth for brands. Specializes in business management, strategy creation, P&L management, and technology media.
                  </p>
                </div>
              </div>

              {/* Digital Marketer */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-lg shadow-lg">
                <div className="text-center">
                  <img 
                    src="/assets/digital-marketer-brazdo-profile.png" 
                    alt="Brazdo Scott - Digital Marketer" 
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-orange-200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Brazdo Scott
                  </h3>
                  <p className="text-orange-600 font-semibold mb-4">
                    Digital Marketer
                  </p>
                  <blockquote className="text-orange-600 italic mb-4 text-sm">
                    "We exist to inspire the world to DREAM BIGGER"
                  </blockquote>
                  <p className="text-gray-600 text-sm">
                    Marketing expert with MBA from Stetson University. Specializes in branding, internet marketing, digital marketing, web development, and search engine optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nedaxer Cares */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nedaxer Cares
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-600 mb-8">
                  We understand how much you actually want to achieve certain great heights such as owning your home/house and putting up other houses out for rent and sale, buying your dream car or even starting up that business, but you are burdened with other financial responsibilities from everyone and coupled with your goals.
                </p>
                <p className="text-lg text-gray-600">
                  Hence it is important to us at Nedaxer to aid you bring that goal to fruition while reaching out to your financial needs. That is why we have created the Nedaxer-Cares Trading Plan that would help you invest a portion capital of what you want and watch us help you achieve that goal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Legal & Compliance
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fully registered and compliant with international financial regulations
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Canada Company Registration
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Nedaxer Ltd is fully registered with the Canada Business Corporations Act as a legal and trusted business entity under The Canada Business Corporations Act.
                  </p>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Company Number:</strong> 07526337
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Registration Date:</strong> 28th January 2021
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Registrar:</strong> A.E Thomas for the Registrar of Companies
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Certification:</strong> Canada Company House Certification
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Certified & Compliant
                    </h4>
                    <p className="text-sm text-gray-600">
                      Operating under full regulatory compliance with international financial standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Common questions about Nedaxer investment plans and services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* FAQ Column 1 */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What is NFP Trade?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    NFP Trade is a specialized trading strategy focusing on Non-Farm Payroll announcements. It offers 25% ROI after 24 hours with minimum investment of $2,000 and maximum of $30,000.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How does the Fixed Deposit plan work?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our Fixed Deposit plan offers 16% biweekly returns with minimum investment of $500 and unlimited maximum. The interest is paid on periodic basis depending on the company's setup.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Is Nedaxer legally registered?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, Nedaxer Ltd is fully registered with the Canada Business Corporations Act under Company Number 07526337, registered on 28th January 2021.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What are the referral commissions?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We offer 10% referral commission on first deposit for both NFP Trade and Fixed Deposit plans, helping you earn additional returns by referring friends and family.
                  </p>
                </div>
              </div>

              {/* FAQ Column 2 */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Can I withdraw funds before maturity?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    For Fixed Deposit plans, you are not allowed to withdraw funds before maturity. However, other plans may have different withdrawal terms and conditions.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What is Pattern Day Trading?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Pattern Day Trading is designed for experienced traders seeking enhanced returns with advanced strategies, real-time market analysis, and dedicated expert support.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How secure are my investments?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    All investments are secured through our registered legal entity status, professional risk management, and compliance with international financial regulations.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-red-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    When do I see investment profits?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    NFP Trade investment profits reflect on your dashboard after 24 hours, while Fixed Deposit returns are paid biweekly according to the investment terms.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Images */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <img 
                  src="/assets/nedaxer-faqs.png" 
                  alt="Nedaxer FAQ Section" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="text-center">
                <img 
                  src="/assets/nedaxer-faqs-2.png" 
                  alt="Nedaxer FAQ Additional Information" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who trust Nedaxer for their investment needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownloadBrochure}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Brochure
              </Button>
              <Link href="/account/register">
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Open Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}