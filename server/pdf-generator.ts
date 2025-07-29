import fs from 'fs';
import path from 'path';

export function generateBrochurePDF(): string {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nedaxer Investment Brochure</title>
    <script>
        // Auto-trigger print dialog when page loads
        window.onload = function() {
            // Show instructions for 2 seconds, then print
            setTimeout(function() {
                window.print();
            }, 2000);
        }
    </script>
    <style>
        @page {
            margin: 0;
            size: A4;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
        }
        
        .page {
            min-height: 100vh;
            page-break-after: always;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .cover-page {
            background: linear-gradient(135deg, #f97316, #2563eb);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 4rem;
        }
        
        .cover-page h1 {
            font-size: 4rem;
            font-weight: bold;
            margin: 1rem 0;
        }
        
        .cover-page h2 {
            font-size: 2.5rem;
            font-weight: 300;
            margin: 1rem 0;
        }
        
        .cover-page p {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        
        .logo {
            height: 80px;
            margin: 2rem 0;
        }
        
        .content-page {
            padding: 3rem;
            background: white;
        }
        
        .blue-bg {
            background: #eff6ff;
        }
        
        .orange-bg {
            background: #fff7ed;
        }
        
        h2 {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 2rem;
        }
        
        .orange-text {
            color: #ea580c;
        }
        
        .blue-text {
            color: #2563eb;
        }
        
        p {
            font-size: 1.125rem;
            line-height: 1.75;
            margin-bottom: 1.5rem;
            color: #374151;
        }
        
        .toc-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 1.125rem;
        }
        
        .toc-number {
            color: #ea580c;
            font-weight: bold;
        }
        
        .page-number {
            position: absolute;
            bottom: 3rem;
            right: 3rem;
            font-size: 4rem;
            font-weight: bold;
            color: rgba(234, 88, 12, 0.1);
        }
        
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            margin: 2rem 0;
        }
        
        .card {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .card h3 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        
        .feature-box {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            margin-bottom: 3rem;
        }
        
        .feature-box h3 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        
        .print-instructions {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #f97316;
            color: white;
            text-align: center;
            padding: 1rem;
            font-size: 1.25rem;
            font-weight: bold;
            z-index: 9999;
        }
        
        @media print {
            .print-instructions {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="print-instructions">
        📄 Nedaxer Brochure - Print dialog will open in 2 seconds. Select "Save as PDF" to download.
    </div>
    <!-- Cover Page -->
    <div class="page cover-page">
        <h1>Creating a</h1>
        <div style="background: white; padding: 1rem; border-radius: 1rem; margin: 2rem 0;">
            <div style="color: #ea580c; font-size: 2rem; font-weight: bold; letter-spacing: 0.1em;">NEDAXER</div>
        </div>
        <h2>brochure</h2>
        <p>January . 25</p>
        <div style="margin-top: 4rem;">
            <h3 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">Promising Future</h3>
            <h4 style="font-size: 2rem; font-weight: 300;">Welcome to the future</h4>
        </div>
    </div>

    <!-- Table of Contents -->
    <div class="page content-page">
        <h2 class="orange-text">Table of Content</h2>
        <div style="margin-bottom: 3rem;">
            <div class="toc-item">
                <span class="toc-number">01</span>
                <span>Table of Content</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">02</span>
                <span>Introduction</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">03</span>
                <span>About Us & Who we Are</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">04</span>
                <span>What We Do</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">06</span>
                <span>Why Nedaxer Investment</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">07</span>
                <span>Why Invest With Nedaxer</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">08</span>
                <span>Nedaxer-Cares</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">10</span>
                <span>Nedaxer Investment Plans</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">29</span>
                <span>Testimonials</span>
            </div>
            <div class="toc-item">
                <span class="toc-number">32</span>
                <span>FAQs</span>
            </div>
        </div>
        <div class="page-number">02</div>
    </div>

    <!-- Introduction -->
    <div class="page content-page blue-bg">
        <h2 class="blue-text">INTRODUCTION</h2>
        <p>
            Nedaxer has distinguished itself through its core principles of reliability,
            transparency, judgment, innovation and a relentless focus on generating
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
        <div class="page-number">03</div>
    </div>

    <!-- About Us -->
    <div class="page content-page">
        <h2 class="orange-text">ABOUT US</h2>
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

        <h3 style="font-size: 2.5rem; font-weight: bold; color: #2563eb; margin: 3rem 0 1.5rem 0;">WHO WE ARE</h3>
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
        <div class="page-number">04</div>
    </div>

    <!-- What We Do -->
    <div class="page content-page orange-bg">
        <h2 class="orange-text" style="text-align: center;">WHAT WE DO</h2>
        
        <div class="grid">
            <div class="card">
                <h3 class="orange-text">Cryptocurrency</h3>
                <p>
                    Our crypto teams operate across global markets with advanced trading 
                    strategies focusing on major cryptocurrencies and emerging digital assets.
                </p>
            </div>

            <div class="card">
                <h3 class="blue-text">Digital Assets</h3>
                <p>
                    Since inception, our digital asset investments have generated significant 
                    returns across diverse portfolios in multiple markets worldwide.
                </p>
            </div>

            <div class="card">
                <h3 class="orange-text">Trading Systems</h3>
                <p>
                    Our advanced trading systems and algorithms have managed substantial 
                    cryptocurrency portfolios with proven track records over the years.
                </p>
            </div>

            <div class="card">
                <h3 class="blue-text">Strategic Capital</h3>
                <p>
                    Our Strategic Capital group focuses on acquiring minority interests in 
                    alternative asset managers with strong track records, exceptional teams, 
                    and attractive growth prospects.
                </p>
            </div>
        </div>
        <div class="page-number">05</div>
    </div>

    <!-- Why Nedaxer -->
    <div class="page content-page" style="text-align: center;">
        <h2 class="orange-text" style="font-size: 4rem;">why?</h2>
        <div style="background: white; padding: 1rem; border-radius: 1rem; margin: 2rem auto; display: inline-block;">
            <div style="color: #ea580c; font-size: 2.5rem; font-weight: bold; letter-spacing: 0.1em;">NEDAXER</div>
        </div>
        
        <div style="text-align: left; max-width: 800px; margin: 0 auto;">
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
        <div class="page-number">07</div>
    </div>

    <!-- Why Invest With Us -->
    <div class="page content-page blue-bg">
        <h2 class="blue-text" style="text-align: center;">WHY INVEST WITH US</h2>
        
        <div class="feature-box">
            <h3 class="orange-text">SIMPLE</h3>
            <p>
                We ensure that investing is stress free and easy. You don't have to pass through
                difficulties like finding the right investment brand or worrying about how fast your
                investment is going to yield. Our job is to make everything easy for you.
            </p>
        </div>

        <div class="feature-box">
            <h3 class="blue-text">ROBUST</h3>
            <p>
                Imagine waking every morning knowing your money is multiplying somewhere,
                Awesome right? With our laid down investment structures, we ensure that our
                clients always get their return on investments in the stated and agreed time.
            </p>
        </div>

        <div class="feature-box">
            <h3 class="orange-text">SECURE</h3>
            <p>
                Letting money for a period of time to yield results has never been easy coupled with
                bad past experiences people might have had. Honesty and transparency is key for us
                at Nedaxer that is why we are fully registered as a legal and trusted business entity.
            </p>
        </div>
        <div class="page-number">08</div>
    </div>

    <!-- Nedaxer Cares -->
    <div class="page content-page">
        <div style="text-align: center; margin-bottom: 3rem;">
            <h2 class="orange-text">Nedaxer CARES</h2>
        </div>
        
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

        <div style="background: #fff7ed; padding: 2rem; border-radius: 0.5rem; margin-top: 3rem;">
            <h3 style="font-size: 2rem; font-weight: bold; color: #2563eb; margin-bottom: 1.5rem;">NEDAXER PLANS</h3>
            <p>
                Nedaxer Offers multiple standard plans and specialized crypto investment 
                briefcases that will allow each person to plunge into the interesting and 
                profitable world of crypto investment. Here, everyone will find an interesting offer. 
                After depositing funds on a particular investment plan, they are added to the general 
                pool on which the trade takes place. Interest is calculated and credited to your account.
            </p>
        </div>
        <div class="page-number">09</div>
    </div>
</body>
</html>
  `;
  
  return htmlContent;
}