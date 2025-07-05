
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export const CTASection = () => {
  return (
    <section className="py-12 bg-[#f5f5f5]">
      <div className="container mx-auto px-4">
        <div className="bg-[#0033a0] rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to start trading?
              </h2>
              <p className="text-white mb-6">
                Open an account today and get access to our full range of products, markets, and educational resources.
              </p>
              <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-semibold px-6 py-3 rounded-md w-full md:w-auto"
                >
                  <Link href="/account/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80"
                alt="Trading Platform"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
