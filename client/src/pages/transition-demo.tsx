import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Home, Users, Settings, BarChart3, CreditCard, Eye, EyeOff } from 'lucide-react';

export default function TransitionDemo() {
  const [location] = useLocation();

  const transitionPages = [
    {
      title: 'Company Pages',
      description: 'Landing and corporate pages with glass slide effects',
      pages: [
        { name: 'About', path: '/company/about', icon: Users },
        { name: 'Contact', path: '/company/contact', icon: Users },
        { name: 'Careers', path: '/company/careers', icon: Users },
      ]
    },
    {
      title: 'Account Pages',
      description: 'Authentication pages with transitions',
      pages: [
        { name: 'Login', path: '/account/login', icon: Users },
        { name: 'Register', path: '/account/register', icon: Users },
        { name: 'Forgot Password', path: '/account/forgot-password', icon: Settings },
      ]
    },
    {
      title: 'Mobile Secondary Pages',
      description: 'Mobile app pages with glass slide transitions',
      pages: [
        { name: 'Profile', path: '/mobile/profile', icon: Users },
        { name: 'Security', path: '/mobile/security', icon: Settings },
        { name: 'Notifications', path: '/mobile/notifications', icon: Settings },
        { name: 'Futures Trading', path: '/mobile/futures', icon: BarChart3 },
        { name: 'Assets History', path: '/mobile/assets-history', icon: CreditCard },
      ]
    }
  ];

  const excludedPages = [
    { name: 'Mobile Home', path: '/mobile', description: 'Main mobile page - NO transition' },
    { name: 'Assets', path: '/mobile/assets', description: 'Main mobile page - NO transition' },
    { name: 'Trade', path: '/mobile/trade', description: 'Main mobile page - NO transition' },
    { name: 'Markets', path: '/mobile/markets', description: 'Main mobile page - NO transition' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Glass Slide Transition Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the sleek fintech-style navigation animations with glass morphism effects. 
            Pages slide in from the right with beautiful backdrop blur effects.
          </p>
          <Badge variant="outline" className="mt-4 text-orange-600 border-orange-200">
            Current Path: {location}
          </Badge>
        </div>

        <div className="grid gap-8">
          {/* Transition-enabled Pages */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="h-6 w-6 text-green-600" />
              Pages WITH Glass Slide Transitions
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transitionPages.map((section) => (
                <Card key={section.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">{section.title}</CardTitle>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.pages.map((page) => {
                      const Icon = page.icon;
                      return (
                        <Link key={page.path} href={page.path}>
                          <Button
                            variant={location === page.path ? "default" : "outline"}
                            className="w-full justify-between group hover:bg-gradient-to-r hover:from-blue-500 hover:to-orange-500 hover:text-white transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {page.name}
                            </span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Excluded Pages */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <EyeOff className="h-6 w-6 text-red-600" />
              Pages WITHOUT Transitions (As Requested)
            </h2>
            
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Main Mobile Navigation Pages</CardTitle>
                <p className="text-sm text-gray-600">
                  These core mobile pages have transitions disabled for optimal performance
                </p>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                {excludedPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium text-gray-900">{page.name}</div>
                      <div className="text-xs text-gray-500">{page.description}</div>
                    </div>
                    <Badge variant="secondary" className="text-red-600 bg-red-100">
                      No Transition
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="bg-gradient-to-r from-blue-600 to-orange-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Glass Slide Transition Features</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>✨ Glass Morphism</strong>
                  <p>backdrop-filter: blur(10px) with translucent overlay</p>
                </div>
                <div>
                  <strong>🎯 Smooth Animation</strong>
                  <p>Custom cubic-bezier easing for professional feel</p>
                </div>
                <div>
                  <strong>📱 Mobile Optimized</strong>
                  <p>Reduced blur (5px) and faster timing on mobile</p>
                </div>
                <div>
                  <strong>⚡ Hardware Accelerated</strong>
                  <p>Transform and opacity for 60fps performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700">
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}