import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { MapPin, Clock, HelpCircle, MessageSquare, Shield, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Contact() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });

  // Check URL parameters for redirect after login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectedFromLogin = urlParams.get('from') === 'login';
    
    if (redirectedFromLogin && user) {
      toast({
        title: "Welcome back!",
        description: "You can now submit your message below.",
      });
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, toast]);

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Contact form submission mutation
  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to send message');
      }
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent Successfully!",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Reset form
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium'
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      // Store current page for redirect after login
      localStorage.setItem('contactFormRedirect', 'true');
      setLocation('/login?redirect=contact');
      toast({
        title: "Login Required",
        description: "Please log in to send us a message.",
      });
      return;
    }

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.message.length > 5000) {
      toast({
        title: "Message Too Long",
        description: "Please keep your message under 5000 characters.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const contactOptions = [
    {
      title: "General Inquiries",
      description: "Questions about our platform, our products, or how to get started?",
      icon: <HelpCircle className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Customer Support",
      description: "Account-related questions, technical issues, or trading assistance.",
      icon: <MessageSquare className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Security & Compliance",
      description: "Questions about KYC, account security, or regulatory matters.",
      icon: <Shield className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Technical Analysis Team",
      description: "Help with chart analysis, indicators, or trading strategies.",
      icon: <Zap className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  return (
    <PageLayout 
      title="Contact Us" 
      subtitle="Get in touch with our team for any questions or assistance"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Get in Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {contactOptions.map((option, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="mr-4">{option.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{option.title}</h3>
                    <p className="text-gray-700">{option.description}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Please use the contact form below to reach out to our team.
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Contact Form</h2>
          
          {!user && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <h3 className="text-sm font-semibold text-orange-800">Login Required</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    You need to be logged in to send us a message. 
                    <Link href="/login?redirect=contact" className="text-orange-600 hover:text-orange-800 underline ml-1">
                      Click here to log in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="focus:ring-2 focus:ring-[#0033a0] focus:border-[#0033a0]"
                    disabled={!user}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="focus:ring-2 focus:ring-[#0033a0] focus:border-[#0033a0]"
                    disabled={!user}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="focus:ring-2 focus:ring-[#0033a0] focus:border-[#0033a0]"
                  disabled={!user}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)} disabled={!user}>
                    <SelectTrigger className="focus:ring-2 focus:ring-[#0033a0] focus:border-[#0033a0]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiries</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="security">Security & Compliance</SelectItem>
                      <SelectItem value="technical">Technical Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)} disabled={!user}>
                    <SelectTrigger className="focus:ring-2 focus:ring-[#0033a0] focus:border-[#0033a0]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter the subject of your message"
                  className="focus:ring-2 focus:ring-[#0033a0] focus:border-[#0033a0]"
                  disabled={!user}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your detailed message here..."
                  className="resize-none min-h-[120px] focus:ring-2 focus:ring-[#0033a0] focus:border-[#0033a0]"
                  disabled={!user}
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.message.length}/5000 characters
                </p>
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#0033a0] hover:bg-[#002680] text-white px-8 py-3 font-medium"
                  disabled={!user || contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}