import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Briefcase, Users, Heart, Brain, Coffee, ArrowRight } from "lucide-react";

// Import team photos
import teamMainPhoto from "/team_photos/team_main.png";
import teamPhoto1 from "/team_photos/team_1.png";
import teamPhoto2 from "/team_photos/team_2.png";
import teamPhoto3 from "/team_photos/team_3.png";
import teamPhoto4 from "/team_photos/team_4.png";
import teamPhoto5 from "/team_photos/team_5.png";
import teamPhoto6 from "/team_photos/team_6.png";

export default function Careers() {
  const coreValues = [
    {
      title: "Innovation",
      description: "We encourage creative thinking and continuous improvement to drive the evolution of our products and services.",
      icon: <Brain className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Integrity",
      description: "We operate with honesty, transparency, and ethical behavior in all our actions and decisions.",
      icon: <Heart className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Collaboration",
      description: "We work together across teams, valuing diverse perspectives to achieve common goals.",
      icon: <Users className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Customer Focus",
      description: "We are dedicated to understanding and meeting the needs of our customers in everything we do.",
      icon: <Coffee className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const benefits = [
    {
      title: "Competitive Compensation",
      description: "Competitive salary packages with performance bonuses and equity opportunities.",
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive medical, dental, and vision coverage, plus wellness programs and gym subsidies.",
    },
    {
      title: "Work-Life Balance",
      description: "Flexible work arrangements, generous PTO, and paid parental leave.",
    },
    {
      title: "Professional Development",
      description: "Continuous learning opportunities, educational assistance, and career growth paths.",
    },
    {
      title: "Retirement Planning",
      description: "401(k) plan with company matching to help you build for the future.",
    },
    {
      title: "Team Events",
      description: "Regular team-building activities, social events, and company celebrations.",
    },
  ];

  const jobOpenings = [
    {
      title: "Senior Software Engineer",
      department: "Technology",
      location: "Chicago, IL",
      type: "Full-time",
      id: "TECH-SE-001",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Chicago, IL",
      type: "Full-time",
      id: "PROD-PM-002",
    },
    {
      title: "Market Analyst",
      department: "Trading",
      location: "Chicago, IL",
      type: "Full-time",
      id: "TRD-MA-003",
    },
    {
      title: "Customer Support Specialist",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      id: "OPS-CSS-004",
    },
    {
      title: "Compliance Officer",
      department: "Legal & Compliance",
      location: "Chicago, IL",
      type: "Full-time",
      id: "LEG-CO-005",
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      id: "MKT-MS-006",
    },
  ];

  return (
    <PageLayout 
      title="Careers at Nedaxer" 
      subtitle="Join our team and help shape the future of derivatives trading"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Join Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="mb-4">
                At Nedaxer, we're building innovative trading solutions that empower retail traders to access the financial markets with limited risk. 
                Our team combines expertise in financial markets, technology, and customer service to deliver a world-class trading experience.
              </p>
              <p className="mb-4">
                We're looking for passionate, talented individuals who share our commitment to innovation, integrity, and customer focus. 
                If you're excited about the intersection of finance and technology, and want to be part of a dynamic, collaborative team, 
                we'd love to hear from you.
              </p>
              <Button
                asChild
                className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold px-6 py-2 mt-2"
              >
                <Link href="#openings">View Open Positions</Link>
              </Button>
            </div>
            
            {/* Team Image */}
            <div className="rounded-lg overflow-hidden h-64">
              <img 
                src={teamMainPhoto} 
                alt="Nedaxer Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((value, i) => (
              <div key={i} className="flex items-start p-6 bg-[#f5f5f5] rounded-lg">
                <div className="mr-4">{value.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Benefits & Perks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div id="openings" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Current Openings</h2>
          
          <div className="space-y-6">
            {jobOpenings.map((job, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="md:flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">{job.department}</span>
                      <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">{job.location}</span>
                      <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">{job.type}</span>
                    </div>
                    <div className="text-sm text-gray-500">Job ID: {job.id}</div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button
                      asChild
                      className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold"
                    >
                      <Link href="#">View Job Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-700 mb-4">
              Don't see a position that matches your skills? We're always interested in hearing from talented individuals.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
            >
              <Link href="#">Submit General Application</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Life at Nedaxer</h2>
          
          {/* Team Photo Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg overflow-hidden h-48">
              <img src={teamPhoto1} alt="Nedaxer Team" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden h-48">
              <img src={teamPhoto2} alt="Nedaxer Team" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden h-48">
              <img src={teamPhoto3} alt="Nedaxer Team" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden h-48">
              <img src={teamPhoto4} alt="Nedaxer Team" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden h-48">
              <img src={teamPhoto5} alt="Nedaxer Team" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden h-48">
              <img src={teamPhoto6} alt="Nedaxer Team" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Employee Testimonials</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-[#0033a0] pl-4">
                <p className="italic mb-2">
                  "Working at Nedaxer has been an incredible journey. The company truly values innovation and 
                  encourages us to bring new ideas to the table. I've grown professionally while being part 
                  of a team that's changing how retail traders access the financial markets."
                </p>
                <div className="font-semibold">- Software Engineer, 3 years at Nedaxer</div>
              </div>
              
              <div className="border-l-4 border-[#0033a0] pl-4">
                <p className="italic mb-2">
                  "The collaborative culture at Nedaxer sets it apart from other places I've worked. 
                  There's a real sense of teamwork across departments, and leadership is accessible 
                  and supportive. The work-life balance and benefits are excellent too!"
                </p>
                <div className="font-semibold">- Product Manager, 2 years at Nedaxer</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Our Hiring Process</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-[#0033a0] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0 mr-4">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Application Review</h3>
                <p className="text-gray-700">
                  Our recruiting team reviews your application and resume to assess your qualifications 
                  and experience relative to the position requirements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#0033a0] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0 mr-4">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Initial Screening</h3>
                <p className="text-gray-700">
                  If your profile aligns with our needs, you'll participate in a phone or video screening 
                  with a recruiter to discuss your background and interest in the role.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#0033a0] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0 mr-4">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Skills Assessment</h3>
                <p className="text-gray-700">
                  Depending on the role, you may be asked to complete a skills assessment or technical 
                  challenge to demonstrate your capabilities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#0033a0] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0 mr-4">4</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Team Interviews</h3>
                <p className="text-gray-700">
                  You'll meet with several team members, including potential colleagues and managers, 
                  to discuss your experience, skills, and fit with our culture.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#0033a0] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold flex-shrink-0 mr-4">5</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Final Decision & Offer</h3>
                <p className="text-gray-700">
                  After gathering feedback from all interviewers, we'll make a decision and extend an 
                  offer to the selected candidate, followed by onboarding preparations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="mb-6">Explore our current openings and take the next step in your career with Nedaxer.</p>
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3"
          >
            <Link href="#openings">View Open Positions</Link>
          </Button>
          <div className="mt-4">
            <Link 
              href="/company/contact" 
              className="text-white hover:text-[#ff5900] font-semibold flex items-center justify-center"
            >
              Questions about careers at Nedaxer? Contact Us <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}