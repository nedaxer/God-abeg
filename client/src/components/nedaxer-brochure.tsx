import { useState } from 'react';

const NedaxerBrochure = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Logo component using your existing assets
  const NedaxerLogo = ({ className = "" }) => (
    <img 
      src="/splash-assets/nedaxer-logo.png" 
      alt="Nedaxer" 
      className={`h-8 ${className}`}
    />
  );

  const NedaxerIcon = ({ className = "" }) => (
    <img 
      src="/splash-assets/nedaxer-icon.png" 
      alt="Nedaxer Icon" 
      className={`w-6 h-6 ${className}`}
    />
  );

  const pages = [
    // Cover Page
    {
      id: 'cover',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600 text-white flex flex-col justify-center items-center p-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold tracking-wider">Creating a</h1>
              <NedaxerLogo className="h-16 mx-auto" />
              <h2 className="text-4xl font-light">brochure</h2>
              <p className="text-xl opacity-90">January . 25</p>
            </div>
            <div className="mt-16">
              <h3 className="text-4xl font-bold mb-4">Promising Future</h3>
              <h4 className="text-3xl font-light">Welcome to the future</h4>
            </div>
          </div>
        </div>
      )
    },

    // Table of Contents
    {
      id: 'toc',
      content: (
        <div className="min-h-screen bg-white p-12">
          <h2 className="text-4xl font-bold text-orange-600 mb-12">Table of Content</h2>
          <div className="space-y-4 text-lg">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">01</span>
              <span>Table of Content</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">02</span>
              <span>Introduction</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">03</span>
              <span>About Us & Who we Are</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">04</span>
              <span>What We Do</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">06</span>
              <span>Why Nedaxer Investment</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">07</span>
              <span>Why Invest With Nedaxer</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">08</span>
              <span>Nedaxer-Cares</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">09</span>
              <span>Company House Certification</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">10</span>
              <span>Nedaxer Investment Plans</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">22</span>
              <span>Nedaxer Analysis</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">24</span>
              <span>Who is behind Nedaxer</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">29</span>
              <span>Testimonials</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">31</span>
              <span>Our Affiliate Program</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">32</span>
              <span>FAQs</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-orange-500 font-semibold">35</span>
              <span>Terms & Conditions</span>
            </div>
          </div>
          <div className="mt-16 text-6xl font-bold text-orange-100">02</div>
        </div>
      )
    },

    // Introduction
    {
      id: 'introduction',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-blue-600 mb-8">INTRODUCTION</h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                Nedaxer has distinguished itself through its core principles of reliability,
                transparency, judgment, innovation and a relentless focus on generating
                superior results. We combine the breadth of our global assets and resources
                with an entrepreneurial approach and personalized service, offering individual
                and institutional clients tailored alternative investment opportunities.
              </p>
              <p>
                Our diversified portfolio spans across multiple asset classes and numerous 
                product lines. Accessed through our highly personal and responsive service 
                and global distribution platform, it offers an increasingly diverse portfolio 
                of investment opportunities for discerning investors everywhere.
              </p>
              <p>
                With our diversified asset classes and product offerings, Nedaxer is 
                positioned as a leading alternative asset manager with a focus on 
                cryptocurrency and digital asset management.
              </p>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">03</div>
          </div>
        </div>
      )
    },

    // About Us
    {
      id: 'about',
      content: (
        <div className="min-h-screen bg-white p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-orange-600 mb-8">ABOUT US</h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700 mb-12">
              <p>
                Since our founding, Nedaxer has thrived because of the trust we have
                earned from our stakeholders. As we continue to grow and expand, we remain 
                committed to building upon that trust as we apply our proven and disciplined 
                investment approach across asset classes and geographies as a uniquely global firm.
              </p>
              <p>
                With an entrepreneurial spirit and prudent institutional practices, Nedaxer
                prioritizes our relationships and driving sustainable value for those that we are
                privileged to serve.
              </p>
            </div>

            <h3 className="text-4xl font-bold text-blue-600 mb-6">WHO WE ARE</h3>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                Nedaxer is a leading global manager of alternative investments with multiple
                lines of businesses, including: cryptocurrency trading, digital asset management, 
                real estate, strategic capital investments, and innovative fintech solutions.
              </p>
              <p>
                We began as pioneers in digital asset management, acting as a bridge between 
                traditional finance and the cryptocurrency world with a strong service ethos 
                that demanded security-first investments. Through market cycles, we have learned 
                from every trade and opportunity to build client relationships that span 
                generations, offering a diverse and truly global investment portfolio.
              </p>
              <p>
                With a work ethic that is both entrepreneurial in spirit and institutional in 
                practice, and a policy of investment that we seek to make both responsible and
                profitable, we aim to generate strong performance for our valued investors
                around the world.
              </p>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">04</div>
          </div>
        </div>
      )
    },

    // What We Do
    {
      id: 'services',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center text-orange-600 mb-16">WHAT WE DO</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Cryptocurrency Trading */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <NedaxerIcon className="mr-3" />
                  <h3 className="text-2xl font-bold text-orange-600">Cryptocurrency Trading</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Our expert traders operate across global markets with advanced algorithms 
                  and real-time analytics, focusing on major cryptocurrencies including 
                  Bitcoin, Ethereum, and emerging altcoins.
                </p>
              </div>

              {/* Digital Asset Management */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-blue-600">Digital Asset Management</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Since inception, our digital asset investments have totaled significant 
                  returns across diverse cryptocurrency portfolios in global markets.
                </p>
              </div>

              {/* DeFi & Staking */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-2xl font-bold text-orange-600">DeFi & Staking</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Our DeFi specialists manage staking protocols and yield farming 
                  strategies, maximizing returns through innovative blockchain technologies.
                </p>
              </div>

              {/* Strategic Capital */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-blue-600">Strategic Capital</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Our Strategic Capital group focuses on acquiring positions in 
                  promising blockchain projects with strong fundamentals, exceptional 
                  teams, and attractive growth prospects.
                </p>
              </div>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">05</div>
          </div>
        </div>
      )
    },

    // Why Nedaxer
    {
      id: 'why-nedaxer',
      content: (
        <div className="min-h-screen bg-white p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-6xl font-bold text-orange-600 mb-4">why?</h2>
            <NedaxerLogo className="h-20 mx-auto mb-12" />
            
            <div className="text-lg leading-relaxed text-gray-700 space-y-6 text-left">
              <p>
                We assist clients with multiple interactive services into the huge untapped
                cryptocurrency market with a recipe for success. Our methods have been tried and tested by
                major expert analysts and investment specialists, proving our successful formula.
              </p>
              <p>
                With professional background credibility, we are here to ensure that your financial 
                present and future are on the path to success. Nedaxer is a cryptocurrency and
                prestigious digital asset management company established with the vision of 
                democratizing access to digital wealth.
              </p>
              <p>
                Nedaxer Investment's pride is investing on behalf of our clients — from large institutions to
                parents and grandparents, teachers, nurses, doctors and everyone who entrust
                their funds to us. We are responsible for the support, marketing, customer and partner
                communication. Our headquarters coordinates the opening of new opportunities
                throughout the world.
              </p>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">07</div>
          </div>
        </div>
      )
    },

    // Why Invest With Us
    {
      id: 'why-invest',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-blue-600 mb-16 text-center">WHY INVEST WITH US</h2>
            
            <div className="space-y-12">
              {/* Simple */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-8 h-8 text-orange-600 mr-4" />
                  <h3 className="text-3xl font-bold text-orange-600">SIMPLE</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We ensure that investing is stress free and easy. You don't have to pass through
                  difficulties like finding the right investment strategy or worrying about how fast your
                  investment is going to yield. Our job is to make everything easy for you.
                </p>
              </div>

              {/* Robust */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600 mr-4" />
                  <h3 className="text-3xl font-bold text-blue-600">ROBUST</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Imagine waking every morning knowing your money is multiplying somewhere.
                  Awesome right? With our laid down investment structures, we ensure that our
                  clients always get their return on investments in the stated and agreed time.
                </p>
              </div>

              {/* Secure */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Lock className="w-8 h-8 text-orange-600 mr-4" />
                  <h3 className="text-3xl font-bold text-orange-600">SECURE</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Investing in digital assets has never been easier coupled with advanced security measures.
                  Honesty and transparency is key for us at Nedaxer. That is why we implement 
                  industry-leading security protocols as a trusted business entity.
                </p>
              </div>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">08</div>
          </div>
        </div>
      )
    },

    // Nedaxer Cares
    {
      id: 'nedaxer-cares',
      content: (
        <div className="min-h-screen bg-white p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <NedaxerIcon className="mr-3" />
                <h2 className="text-5xl font-bold text-orange-600">Nedaxer CARES</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                We understand how much you actually want to achieve certain great heights such as
                owning your home/house and putting up other houses out for rent and sale, buying
                your dream car or even starting up that business; but you are burdened with other
                financial responsibilities from every end coupled with your goals.
              </p>
              <p>
                Hence it is important to us at Nedaxer to aid you bring that goal to fruition
                while reaching out to your financial needs. That is why we have created the
                Nedaxer-Cares Trading Plan that would help you invest a portion of capital of what you
                want and watch us help you achieve that goal.
              </p>
            </div>

            <div className="mt-12 bg-gradient-to-r from-orange-100 to-blue-100 p-8 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-6">NEDAXER PLANS</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nedaxer offers multiple standard and specialized crypto investment programs that allow 
                each person to plunge into the interesting and profitable world of crypto investment. 
                Here, everyone will find an interesting offer. After depositing funds on a particular 
                investment plan, they are added to our managed portfolios where expert trading takes place. 
                Interest is calculated and credited to your account based on performance.
              </p>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">09</div>
          </div>
        </div>
      )
    },

    // Investment Plans
    {
      id: 'investment-plans',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center text-orange-600 mb-16">NEDAXER INVESTMENT PLANS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Starter Plan */}
              <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-orange-500">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">STARTER PLAN</h3>
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-semibold">Minimum Investment:</span> $500</p>
                  <p><span className="font-semibold">Maximum Investment:</span> $5,000</p>
                  <p><span className="font-semibold">ROI:</span> 15% monthly</p>
                  <p><span className="font-semibold">Duration:</span> 3 months</p>
                  <p><span className="font-semibold">Referral Commission:</span> 5%</p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Instant Withdrawals</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Portfolio Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 transform scale-105">
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm inline-block mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">PROFESSIONAL PLAN</h3>
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-semibold">Minimum Investment:</span> $5,000</p>
                  <p><span className="font-semibold">Maximum Investment:</span> $25,000</p>
                  <p><span className="font-semibold">ROI:</span> 25% monthly</p>
                  <p><span className="font-semibold">Duration:</span> 6 months</p>
                  <p><span className="font-semibold">Referral Commission:</span> 8%</p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Priority Support</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Advanced Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Personal Account Manager</span>
                  </div>
                </div>
              </div>

              {/* VIP Plan */}
              <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-orange-500">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">VIP PLAN</h3>
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-semibold">Minimum Investment:</span> $25,000</p>
                  <p><span className="font-semibold">Maximum Investment:</span> $100,000+</p>
                  <p><span className="font-semibold">ROI:</span> 35% monthly</p>
                  <p><span className="font-semibold">Duration:</span> 12 months</p>
                  <p><span className="font-semibold">Referral Commission:</span> 12%</p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">VIP Support Line</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Exclusive Market Insights</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Direct Trading Signals</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-6">INVESTMENT REGULATIONS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                    <span>All plans have flexible duration options</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                    <span>Investment profits reflect on dashboard in real-time</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                    <span>Any investor can participate regardless of existing plans</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                    <span>Secure multi-signature wallet system</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                    <span>Insurance coverage on all deposits</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                    <span>24/7 automated trading systems</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">10</div>
          </div>
        </div>
      )
    },

    // Testimonials
    {
      id: 'testimonials',
      content: (
        <div className="min-h-screen bg-white p-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center text-blue-600 mb-16">TESTIMONIALS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">James Smith</h4>
                    <p className="text-gray-600 text-sm">Professional Trader</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Nedaxer has completely transformed my approach to cryptocurrency investment. 
                  Their professional team and transparent processes give me confidence in my 
                  financial future. The returns have exceeded my expectations consistently."
                </p>
                <div className="flex text-orange-500 mt-4">
                  ★★★★★
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    MJ
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">Maria Johnson</h4>
                    <p className="text-gray-600 text-sm">Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "As a business owner, I needed a reliable investment platform that could 
                  grow my capital while I focused on my business. Nedaxer's VIP plan has 
                  delivered exceptional results month after month."
                </p>
                <div className="flex text-blue-500 mt-4">
                  ★★★★★
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    DL
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">David Lee</h4>
                    <p className="text-gray-600 text-sm">Software Engineer</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "The technology behind Nedaxer's platform is impressive. Real-time analytics, 
                  secure transactions, and consistent profits make this the best investment 
                  decision I've made in years."
                </p>
                <div className="flex text-orange-500 mt-4">
                  ★★★★★
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    SC
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">Sarah Chen</h4>
                    <p className="text-gray-600 text-sm">Financial Advisor</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "I recommend Nedaxer to all my clients looking for cryptocurrency exposure. 
                  Their professional approach and consistent performance make them stand out 
                  in the digital asset management space."
                </p>
                <div className="flex text-blue-500 mt-4">
                  ★★★★★
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-8 rounded-lg">
                <h3 className="text-3xl font-bold mb-4">Join Thousands of Satisfied Investors</h3>
                <p className="text-xl mb-6">
                  Experience the future of cryptocurrency investment with Nedaxer
                </p>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold">5,000+</div>
                    <div className="text-sm opacity-90">Active Investors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">$50M+</div>
                    <div className="text-sm opacity-90">Assets Under Management</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">98%</div>
                    <div className="text-sm opacity-90">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">29</div>
          </div>
        </div>
      )
    },

    // FAQs
    {
      id: 'faqs',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-center text-orange-600 mb-16">FREQUENTLY ASKED QUESTIONS</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  How secure are my investments with Nedaxer?
                </h3>
                <p className="text-gray-700">
                  Nedaxer employs bank-level security measures including multi-signature wallets, 
                  cold storage for majority of funds, and comprehensive insurance coverage. 
                  All transactions are encrypted and monitored 24/7.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  What cryptocurrencies do you support?
                </h3>
                <p className="text-gray-700">
                  We support major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), 
                  Binance Coin (BNB), Cardano (ADA), Solana (SOL), and many other established 
                  digital assets. Our portfolio is constantly evolving with market trends.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  How quickly can I withdraw my profits?
                </h3>
                <p className="text-gray-700">
                  Withdrawal requests are processed within 24 hours for amounts under $10,000. 
                  Larger withdrawals may take up to 48 hours for additional security verification. 
                  VIP members enjoy priority processing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  Do you offer customer support?
                </h3>
                <p className="text-gray-700">
                  Yes, we provide 24/7 customer support through multiple channels including 
                  live chat, email, and phone support. VIP members have access to dedicated 
                  account managers for personalized assistance.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  What is the minimum investment amount?
                </h3>
                <p className="text-gray-700">
                  Our Starter Plan requires a minimum investment of $500, making cryptocurrency 
                  investment accessible to a wide range of investors. Higher investment tiers 
                  offer enhanced benefits and higher returns.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  How do referral commissions work?
                </h3>
                <p className="text-gray-700">
                  Earn commission ranging from 5% to 12% based on your investment tier when 
                  you refer new investors. Commissions are paid instantly upon successful 
                  deposit by your referrals and can be withdrawn immediately.
                </p>
              </div>
            </div>
            <div className="mt-16 text-6xl font-bold text-orange-100">32</div>
          </div>
        </div>
      )
    },

    // Contact & Final Page
    {
      id: 'contact',
      content: (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600 text-white p-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <NedaxerLogo className="h-20 mx-auto mb-8" />
              <h2 className="text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of successful investors who trust Nedaxer with their financial future
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Globe className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Global Reach</h3>
                <p className="opacity-90">Serving investors worldwide with localized support</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Bank-Level Security</h3>
                <p className="opacity-90">Your investments protected by industry-leading security</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Proven Returns</h3>
                <p className="opacity-90">Consistent performance across all market conditions</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg mb-12">
              <h3 className="text-3xl font-bold mb-6">Get Started Today</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
                  <span className="text-lg">Create your Nedaxer account</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
                  <span className="text-lg">Choose your investment plan</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
                  <span className="text-lg">Start earning returns</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm opacity-75 mb-4">
                © 2025 Nedaxer Investment Platform. All rights reserved.
              </p>
              <p className="text-xs opacity-60">
                Risk Warning: Cryptocurrency investments carry inherent risks. 
                Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="nedaxer-brochure">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Page {currentPage + 1} of {pages.length}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-orange-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
              disabled={currentPage === pages.length - 1}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="page-content">
        {pages[currentPage]?.content}
      </div>

      {/* Page Indicator Dots */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentPage === index 
                  ? 'bg-orange-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NedaxerBrochure;