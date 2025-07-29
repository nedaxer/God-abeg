const SimpleNedaxerBrochure = () => {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="relative">
      {/* Print/Download Button - Hidden when printing */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF</span>
        </button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:break-before {
            break-before: page;
          }
          
          .print\\:break-after {
            break-after: page;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl mx-auto bg-white print:max-w-none print:mx-0">
      {/* Cover Page */}
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-500 to-blue-600 text-white p-12 print:break-after">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold">Creating a</h1>
          <img 
            src="/splash-assets/nedaxer-logo.png" 
            alt="Nedaxer" 
            className="h-20 mx-auto"
          />
          <h2 className="text-4xl font-light">brochure</h2>
          <p className="text-xl">January . 25</p>
          <div className="mt-16">
            <h3 className="text-4xl font-bold">Promising Future</h3>
            <h4 className="text-3xl font-light">Welcome to the future</h4>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="min-h-screen p-12 bg-white print:break-after">
        <h2 className="text-4xl font-bold text-orange-600 mb-12">Table of Content</h2>
        <div className="space-y-4 text-lg">
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">01</span>
            <span>Table of Content</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">02</span>
            <span>Introduction</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">03</span>
            <span>About Us & Who we Are</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">04</span>
            <span>What We Do</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">06</span>
            <span>Why Nedaxer Investment</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">07</span>
            <span>Why Invest With Nedaxer</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">08</span>
            <span>Nedaxer-Cares</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">10</span>
            <span>Nedaxer Investment Plans</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">29</span>
            <span>Testimonials</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-orange-500 font-bold">32</span>
            <span>FAQs</span>
          </div>
        </div>
        <div className="mt-16 text-6xl font-bold text-orange-100">02</div>
      </div>

      {/* Introduction */}
      <div className="min-h-screen p-12 bg-blue-50 print:break-after">
        <h2 className="text-5xl font-bold text-blue-600 mb-8">INTRODUCTION</h2>
        <div className="space-y-6 text-lg text-gray-700">
          <p>
            Nedaxer has distinguished itself through its core principles of reliability,
            transparency, judgment,innovation and a relentless focus on generating
            superior results. We combine the breadth of our global assets and resources
            with an entrepreneurial approach and personalized service, offering individual
            and institutional clients tailored alternative investment opportunities.
          </p>
          <p>
            Our diversified assets under management are diversified across multiple
            continents and asset classes. Accessed through our highly personal and 
            responsive service and global distribution platform, it offers an increasingly 
            diverse portfolio of investment opportunities for discerning investors everywhere.
          </p>
          <p>
            With our diversified asset classes and product offerings, Nedaxer is positioned 
            as a leading alternative asset manager in the cryptocurrency space.
          </p>
        </div>
        <div className="mt-16 text-6xl font-bold text-orange-100">03</div>
      </div>

      {/* About Us */}
      <div className="min-h-screen p-12 bg-white print:break-after">
        <h2 className="text-5xl font-bold text-orange-600 mb-8">ABOUT US</h2>
        <div className="space-y-6 text-lg text-gray-700 mb-12">
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
        <div className="space-y-6 text-lg text-gray-700">
          <p>
            Nedaxer is a leading global manager of alternative investments with multiple
            lines of businesses, including: cryptocurrency, digital assets, real estate, 
            strategic capital and innovative financial solutions.
          </p>
          <p>
            We began as pioneers in digital asset management, acting as a bridge between 
            traditional finance and cryptocurrency with a strong service ethos that demanded 
            deal-by-deal investments. Over the years, we have learned from every trade and 
            market cycle to build client relationships that have crossed generations, 
            offering a diverse and truly global investment portfolio.
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

      {/* What We Do */}
      <div className="min-h-screen p-12 bg-orange-50 print:break-after">
        <h2 className="text-5xl font-bold text-center text-orange-600 mb-16">WHAT WE DO</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src="/splash-assets/nedaxer-icon.png" 
                alt="Nedaxer Icon" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-2xl font-bold text-orange-600">Cryptocurrency</h3>
            </div>
            <p className="text-gray-700">
              Our crypto teams operate across global markets with advanced trading 
              strategies focusing on major cryptocurrencies and emerging digital assets.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src="/splash-assets/nedaxer-icon.png" 
                alt="Nedaxer Icon" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-2xl font-bold text-blue-600">Digital Assets</h3>
            </div>
            <p className="text-gray-700">
              Since inception, our digital asset investments have generated significant 
              returns across diverse portfolios in multiple markets worldwide.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src="/splash-assets/nedaxer-icon.png" 
                alt="Nedaxer Icon" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-2xl font-bold text-orange-600">Trading Systems</h3>
            </div>
            <p className="text-gray-700">
              Our advanced trading systems and algorithms have managed substantial 
              cryptocurrency portfolios with proven track records over the years.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src="/splash-assets/nedaxer-icon.png" 
                alt="Nedaxer Icon" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-2xl font-bold text-blue-600">Strategic Capital</h3>
            </div>
            <p className="text-gray-700">
              Our Strategic Capital group focuses on acquiring minority interests in 
              alternative asset managers with strong track records, exceptional teams, 
              and attractive growth prospects.
            </p>
          </div>
        </div>
        <div className="mt-16 text-6xl font-bold text-orange-100">05</div>
      </div>

      {/* Why Nedaxer */}
      <div className="min-h-screen p-12 bg-white text-center print:break-after">
        <h2 className="text-6xl font-bold text-orange-600 mb-4">why?</h2>
        <img 
          src="/splash-assets/nedaxer-logo.png" 
          alt="Nedaxer" 
          className="h-20 mx-auto mb-12"
        />
        
        <div className="text-lg text-gray-700 space-y-6 text-left max-w-4xl mx-auto">
          <p>
            We assist clients with multiple interactive services into the huge untapped
            market with a recipe to success. Our methods have been tried and tested by
            major expert analysts and investment bankers, approving our successful formula.
          </p>
          <p>
            With professional background credibility, We are here to ensure that your financial 
            present and future are on the path to success. Nedaxer is a Cryptocurrency and
            prestigious asset management company established with a vision for the future.
          </p>
          <p>
            Nedaxer Investment pride is investing on behalf of our clients — from large institutions to
            parents and grandparents, teachers, nurses, doctors and everyone who entrust
            their funds to us. It is responsible for the support, marketing, customer and partner
            communication. Headquarters also coordinates the opening of new countries
            throughout the world.
          </p>
        </div>
        <div className="mt-16 text-6xl font-bold text-orange-100">07</div>
      </div>

      {/* Why Invest With Us */}
      <div className="min-h-screen p-12 bg-blue-50 print:break-after">
        <h2 className="text-5xl font-bold text-blue-600 mb-16 text-center">WHY INVEST WITH US</h2>
        
        <div className="space-y-12 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-3xl font-bold text-orange-600 mb-4">SIMPLE</h3>
            <p className="text-lg text-gray-700">
              We ensure that investing is stress free and easy. You don't have to pass through
              difficulties like finding the right investment brand or worrying about how fast your
              investment is going to yield. Our job is to make everything easy for you.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">ROBUST</h3>
            <p className="text-lg text-gray-700">
              Imagine waking every morning knowing your money is multiplying somewhere,
              Awesome right? With our laid down investment structures, we ensure that our
              clients always get their return on investments in the stated and agreed time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-3xl font-bold text-orange-600 mb-4">SECURE</h3>
            <p className="text-lg text-gray-700">
              Letting money for a period of time to yield results has never been easy coupled with
              bad past experiences people might have had. Honesty and transparency is key for us
              at Nedaxer that is why we are fully registered as a legal and trusted business entity.
            </p>
          </div>
        </div>
        <div className="mt-16 text-6xl font-bold text-orange-100">08</div>
      </div>

      {/* Nedaxer Cares */}
      <div className="min-h-screen p-12 bg-white">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/splash-assets/nedaxer-icon.png" 
              alt="Nedaxer Icon" 
              className="w-8 h-8 mr-3"
            />
            <h2 className="text-5xl font-bold text-orange-600">Nedaxer CARES</h2>
          </div>
        </div>
        
        <div className="space-y-6 text-lg text-gray-700 max-w-4xl mx-auto">
          <p>
            We understand how much you actually want to achieve certain great heights such as
            owning your home/house and putting up other houses out for rent and sale, buying
            your dream car or even starting up that business; but you are burdened with other
            financial responsibilities from every end coupled with your goals.
          </p>
          <p>
            Hence it is important to us at Nedaxer to aid you bring that goal to fruition
            while reaching out to your financial needs. That is why we have created the
            Nedaxer-Cares Trading Plan that would help you invest a portion capital of what you
            want and watch us help you achieve that goal.
          </p>
        </div>

        <div className="mt-12 bg-orange-50 p-8 rounded-lg max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-blue-600 mb-6">NEDAXER PLANS</h3>
          <p className="text-lg text-gray-700">
            Nedaxer Offers multiple standard plans and specialized crypto investment 
            briefcases that will allow each person to plunge into the interesting and 
            profitable world of crypto investment. Here, everyone will find an interesting offer. 
            After depositing funds on a particular investment plan, they are added to the general 
            pool on which the trade takes place. Interest is calculated and credited to your account.
          </p>
        </div>
        <div className="mt-16 text-6xl font-bold text-orange-100">09</div>
      </div>
    </div>
    </div>
  );
};

export default SimpleNedaxerBrochure;