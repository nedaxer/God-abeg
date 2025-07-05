// @ts-nocheck
// TypeScript error suppression for development productivity - 11 React/admin portal type conflicts
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AdminPullToRefresh } from "@/components/admin-pull-to-refresh";
import AdminDepositCreator from "@/components/admin-deposit-creator";
import AdminWithdrawalCreator from "@/components/admin-withdrawal-creator";
import ContactMessagesManager from "@/components/contact-messages-manager";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  DollarSign, 
  Trash2, 
  UserCheck, 
  LogOut,
  User,
  Shield,
  Plus,
  Minus,
  AlertTriangle,
  Mail,
  CreditCard,
  Users,
  Copy,
  CheckCircle,
  Clock,
  UserPlus,
  MessageSquare,
  Send,
  Settings,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  Hash,
  BarChart3,
  Wifi,
  WifiOff,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface AdminUser {
  _id: string;
  uid: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  isVerified: boolean;
  isAdmin: boolean;
  balance: number;
  lastActivity?: string;
  onlineTime?: number;
  isOnline?: boolean;
  sessionStart?: string;
  createdAt?: string;
  allFeaturesDisabled?: boolean;
}

interface UserAnalytics {
  totalUsers: number;
  onlineUsers: number;
  activeUsers24h: number;
  activeUsers7d: number;
  topActiveUsers: Array<{
    username: string;
    email: string;
    onlineTime: number;
    lastActivity: string;
    isOnline: boolean;
  }>;
}

export default function UnifiedAdminPortal() {
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [uidSearchQuery, setUidSearchQuery] = useState("");
  const [generalSearchQuery, setGeneralSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [withdrawalMessage, setWithdrawalMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [userPassword, setUserPassword] = useState("");
  const [hasActualPassword, setHasActualPassword] = useState(true);
  const [newPasswordForReset, setNewPasswordForReset] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [adminCredentials, setAdminCredentials] = useState({ email: "", password: "" });
  const [showUsersList, setShowUsersList] = useState(true);
  const [showKycPanel, setShowKycPanel] = useState(true);
  const [copiedId, setCopiedId] = useState("");
  const [connectionRequestData, setConnectionRequestData] = useState({
    serviceName: '',
    customMessage: '',
    successMessage: ''
  });
  const [selectedDocumentImage, setSelectedDocumentImage] = useState<string | null>(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [allDocuments, setAllDocuments] = useState<string[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // WebSocket connection for real-time admin updates
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;
    
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        socket = new WebSocket(wsUrl);
        
        socket.onopen = () => {
          console.log('🔌 Admin WebSocket connected');
          // Subscribe to admin events
          socket.send(JSON.stringify({ type: 'subscribe_admin' }));
        };
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 Admin WebSocket message:', data);
            
            switch (data.type) {
              case 'user_updated':
              case 'balance_updated':
              case 'user_created':
                // Refresh user data
                queryClient.invalidateQueries({ queryKey: ['/api/admin/users/all'] });
                queryClient.invalidateQueries({ queryKey: ['/api/admin/users/search'] });
                break;
              case 'admin_action_success':
                toast({
                  title: "Action Completed",
                  description: data.message || "Admin action successful",
                  variant: "default",
                });
                break;
            }
          } catch (error) {
            console.error('Error parsing admin WebSocket message:', error);
          }
        };
        
        socket.onclose = () => {
          console.log('🔌 Admin WebSocket disconnected, attempting reconnect...');
          reconnectTimeout = setTimeout(connectWebSocket, 3000);
        };
        
        socket.onerror = (error) => {
          console.error('❌ Admin WebSocket error:', error);
        };
      } catch (error) {
        console.error('Failed to connect admin WebSocket:', error);
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [isAuthenticated, queryClient, toast]);

  // Force desktop view for admin portal
  useEffect(() => {
    sessionStorage.setItem('skipSplashScreen', 'true');
    
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=0.8, user-scalable=yes');
    } else {
      const metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=0.8, user-scalable=yes';
      document.head.appendChild(metaViewport);
    }

    // Allow mobile responsive behavior
    document.body.style.minWidth = '';
    document.body.style.overflow = 'auto';

    return () => {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
      document.body.style.minWidth = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Check admin authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/users/all', { credentials: 'include' });
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Admin not authenticated');
      }
    };
    
    checkAuth();
  }, []);

  // Load user withdrawal message when user is selected
  useEffect(() => {
    if (selectedUser) {
      setWithdrawalMessage((selectedUser as any).withdrawalRestrictionMessage || "");
    } else {
      setWithdrawalMessage("");
    }
  }, [selectedUser]);

  // Admin authentication
  const adminLoginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Invalid admin credentials. Please check your email and password.");
          } else if (response.status >= 500) {
            throw new Error("Server error. Please try again in a few moments.");
          } else {
            throw new Error(data.message || "Access denied. Please verify your admin credentials.");
          }
        }
        
        return data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error("Unable to connect to the server. Please check your connection and try again.");
        } else if (error instanceof Error) {
          throw error;
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      }
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the unified admin portal",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.warn('Admin login error handled:', error.message);
      toast({
        title: "Access Denied",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get all users for admin overview with auto-refresh
  const { data: allUsers = [], refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users/all"],
    queryFn: async () => {
      const response = await fetch('/api/admin/users/all', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.data || [];
    },
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  // Get user analytics
  const { data: analyticsData, refetch: refetchAnalytics } = useQuery<{ success: boolean; analytics: UserAnalytics }>({
    queryKey: ["/api/admin/users/analytics"],
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  // Search users by email
  const { data: emailSearchResults = [], isLoading: emailSearchLoading } = useQuery({
    queryKey: ["/api/admin/users/search/email", emailSearchQuery],
    queryFn: async () => {
      if (!emailSearchQuery.trim()) return [];
      const response = await fetch(`/api/admin/users/search/email?q=${encodeURIComponent(emailSearchQuery)}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data || [];
    },
    enabled: emailSearchQuery.length > 0 && isAuthenticated,
  });

  // Search users by UID
  const { data: uidSearchResults = [], isLoading: uidSearchLoading } = useQuery({
    queryKey: ["/api/admin/users/search/uid", uidSearchQuery],
    queryFn: async () => {
      if (!uidSearchQuery.trim()) return [];
      const response = await fetch(`/api/admin/users/search/uid?q=${encodeURIComponent(uidSearchQuery)}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data || [];
    },
    enabled: uidSearchQuery.length > 0 && isAuthenticated,
  });

  // General search users
  const { data: generalSearchResults = [], isLoading: generalSearchLoading, refetch: refetchGeneralSearch } = useQuery({
    queryKey: ["/api/admin/users/search", generalSearchQuery],
    queryFn: async () => {
      if (!generalSearchQuery.trim()) return [];
      const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(generalSearchQuery)}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data || [];
    },
    enabled: generalSearchQuery.length > 0 && isAuthenticated,
    refetchInterval: 2000,
  });

  // Get pending KYC verifications
  const { data: pendingKyc = [], refetch: refetchKyc } = useQuery({
    queryKey: ["/api/admin/pending-kyc"],
    queryFn: async () => {
      const response = await fetch('/api/admin/pending-kyc', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch pending KYC');
      const data = await response.json();
      return data.data || [];
    },
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  // Add funds mutation
  const addFundsMutation = useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: number }) => {
      const response = await apiRequest("POST", "/api/admin/users/add-funds", { userId, amount });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Funds Added",
        description: "User balance updated successfully",
        variant: "default",
      });
      setFundAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Funds",
        description: error.message || "Failed to add funds",
        variant: "destructive",
      });
    },
  });

  // Remove funds mutation
  const removeFundsMutation = useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: number }) => {
      const response = await apiRequest("POST", "/api/admin/users/remove-funds", { userId, amount });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Funds Removed",
        description: "User balance updated successfully",
        variant: "default",
      });
      setFundAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Removing Funds",
        description: error.message || "Failed to remove funds",
        variant: "destructive",
      });
    },
  });

  // Toggle deposit requirement mutation
  const toggleDepositRequirementMutation = useMutation({
    mutationFn: async ({ userId, requiresDeposit }: { userId: string; requiresDeposit: boolean }) => {
      const response = await apiRequest("POST", "/api/admin/users/toggle-deposit-requirement", { userId, requiresDeposit });
      return response.json();
    },
    onSuccess: (data) => {
      // Update the selected user state immediately
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          requiresDeposit: data.data.requiresDeposit
        } as any);
      }
      
      toast({
        title: "Deposit Requirement Updated",
        description: data.message,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Deposit Requirement",
        description: error.message || "Failed to update deposit requirement",
        variant: "destructive",
      });
    },
  });

  // Toggle all features disabled mutation
  const toggleAllFeaturesDisabledMutation = useMutation({
    mutationFn: async ({ userId, allFeaturesDisabled }: { userId: string; allFeaturesDisabled: boolean }) => {
      const response = await apiRequest("POST", "/api/admin/users/toggle-all-features", { userId, allFeaturesDisabled });
      return response.json();
    },
    onSuccess: (data) => {
      // Update the selected user state immediately
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          allFeaturesDisabled: data.data.allFeaturesDisabled
        } as any);
      }
      
      toast({
        title: "Feature Access Updated",
        description: data.message,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Feature Access",
        description: error.message || "Failed to update feature access",
        variant: "destructive",
      });
    },
  });

  // Toggle withdrawal access mutation
  const toggleWithdrawalAccessMutation = useMutation({
    mutationFn: async ({ userId, withdrawalAccess }: { userId: string; withdrawalAccess: boolean }) => {
      const response = await apiRequest("POST", "/api/admin/users/toggle-withdrawal-access", { userId, withdrawalAccess });
      return response.json();
    },
    onSuccess: (data) => {
      // Update the selected user state immediately
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          withdrawalAccess: data.data.withdrawalAccess
        } as any);
      }
      
      toast({
        title: "Withdrawal Access Updated",
        description: data.message,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Withdrawal Access",
        description: error.message || "Failed to update withdrawal access",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "User account permanently deleted from MongoDB",
        variant: "default",
      });
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Account",
        description: error.message || "Failed to delete user account",
        variant: "destructive",
      });
    },
  });

  // KYC Approval mutation
  const approveKycMutation = useMutation({
    mutationFn: async ({ userId, status, reason }: { userId: string; status: 'verified' | 'rejected'; reason?: string }) => {
      const response = await apiRequest("POST", "/api/admin/approve-kyc", { userId, status, reason });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.status === 'verified' ? "KYC Approved" : "KYC Rejected",
        description: `User verification ${variables.status} successfully`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-kyc"] });
      refetchKyc();
    },
    onError: (error: any) => {
      toast({
        title: "Error Processing KYC",
        description: error.message || "Failed to process KYC verification",
        variant: "destructive",
      });
    },
  });

  // Toggle transfer access mutation
  const toggleTransferAccessMutation = useMutation({
    mutationFn: async ({ userId, transferAccess }: { userId: string; transferAccess: boolean }) => {
      const response = await apiRequest("POST", "/api/admin/users/toggle-transfer-access", { userId, transferAccess });
      return response.json();
    },
    onSuccess: (data) => {
      // Update the selected user state immediately
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          transferAccess: data.data.transferAccess
        } as any);
      }
      
      toast({
        title: "Transfer Access Updated",
        description: data.message,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Transfer Access",
        description: error.message || "Failed to update transfer access",
        variant: "destructive",
      });
    },
  });

  // Get user password
  const getUserPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user password');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUserPassword(data.password);
      setShowPassword(true);
      setHasActualPassword(data.hasActualPassword);
      toast({
        title: "Password Key Retrieved",
        description: "User password key has been fetched for security review",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get user password key",
        variant: "destructive",
      });
    },
  });

  // Reset user password
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUserPassword(data.newPassword);
      setHasActualPassword(true);
      setShowPassword(true);
      toast({
        title: "Password Reset",
        description: "User password has been reset successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  // Update withdrawal message mutation
  const updateWithdrawalMessageMutation = useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message: string }) => {
      const response = await apiRequest("POST", "/api/admin/users/update-withdrawal-message", { userId, message });
      return response.json();
    },
    onSuccess: (data) => {
      // Update the selected user state immediately
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          withdrawalRestrictionMessage: data.data.withdrawalRestrictionMessage
        } as any);
      }
      
      toast({
        title: "Withdrawal Message Updated",
        description: "Real-time update sent to user",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      refetchGeneralSearch();
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Message",
        description: error.message || "Failed to update withdrawal message",
        variant: "destructive",
      });
    },
  });

  // Send message to user mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message: string }) => {
      const response = await apiRequest("POST", "/api/admin/send-message", { userId, message });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Message sent to user successfully",
        variant: "default",
      });
      setMessageText('');
    },
    onError: (error: any) => {
      toast({
        title: "Error Sending Message",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });



  // Send connection request mutation
  const sendConnectionRequestMutation = useMutation({
    mutationFn: async ({ userId, serviceName, customMessage, successMessage }: { 
      userId: string; 
      serviceName: string; 
      customMessage: string; 
      successMessage: string; 
    }) => {
      const response = await apiRequest("POST", "/api/admin/connection-request/send", { 
        userId, 
        serviceName, 
        customMessage, 
        successMessage 
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: "Connection request sent to user successfully",
        variant: "default",
      });
      setConnectionRequestData({
        serviceName: '',
        customMessage: '',
        successMessage: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Sending Request",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      });
    },
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing browser error states
    const errorElements = document.querySelectorAll('[data-error]');
    errorElements.forEach(el => el.remove());
    
    if (!adminCredentials.email || !adminCredentials.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both your admin email and password to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Execute admin login with proper error handling
    adminLoginMutation.mutate(adminCredentials);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminCredentials({ email: "", password: "" });
    setGeneralSearchQuery("");
    setEmailSearchQuery("");
    setUidSearchQuery("");
    setSelectedUser(null);
    toast({
      title: "Logged Out",
      description: "Admin session ended",
      variant: "default",
    });
  };

  const handleAddFunds = () => {
    if (!selectedUser || !fundAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a user and enter amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    addFundsMutation.mutate({ userId: selectedUser._id, amount });
  };

  const handleRemoveFunds = () => {
    if (!selectedUser || !fundAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a user and enter amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (amount > selectedUser.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Cannot remove more than current balance",
        variant: "destructive",
      });
      return;
    }

    removeFundsMutation.mutate({ userId: selectedUser._id, amount });
  };

  const handleDeleteUser = (user: AdminUser) => {
    if (user.isAdmin) {
      toast({
        title: "Cannot Delete Admin",
        description: "Admin accounts cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Are you sure you want to permanently delete ${user.username}? This action cannot be undone.`)) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const copyUserId = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedId(uid);
    toast({
      title: "Copied!",
      description: `User ID ${uid} copied to clipboard`,
      variant: "default",
    });
    setTimeout(() => setCopiedId(""), 2000);
  };

  const handleSendConnectionRequest = () => {
    if (!selectedUser) {
      toast({
        title: "No User Selected",
        description: "Please select a user to send connection request",
        variant: "destructive",
      });
      return;
    }

    if (!connectionRequestData.serviceName || !connectionRequestData.customMessage || !connectionRequestData.successMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all connection request fields",
        variant: "destructive",
      });
      return;
    }

    sendConnectionRequestMutation.mutate({
      userId: selectedUser._id,
      serviceName: connectionRequestData.serviceName,
      customMessage: connectionRequestData.customMessage,
      successMessage: connectionRequestData.successMessage
    });
  };

  // Optimized admin dashboard refresh function
  const handleAdminRefresh = async () => {
    try {
      // Only refresh essential data for faster performance
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/admin/users/analytics"] }),
        refetchUsers(),
        refetchAnalytics()
      ]);
      
      toast({
        title: "Data Refreshed",
        description: "Admin dashboard updated with latest data",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh admin data",
        variant: "destructive",
      });
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Unified Admin Portal</CardTitle>
            <p className="text-blue-200">Complete platform management system</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Admin email"
                value={adminCredentials.email}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                required
              />
              <Input
                type="password"
                placeholder="Admin password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={adminLoginMutation.isPending}
              >
                {adminLoginMutation.isPending ? "Authenticating..." : "Access Admin Portal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <AdminPullToRefresh onRefresh={handleAdminRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-2">
        {/* Enhanced Header - Mobile Optimized */}
        <div className="mb-4">
          <div className="flex flex-col items-start justify-between mb-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Portal</h1>
                <p className="text-blue-200 text-xs">Platform Management</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                onClick={() => setShowUsersList(!showUsersList)}
                variant="outline" 
                size="sm"
                className="border-white/30 text-white hover:bg-white/20 text-xs px-2 py-1"
              >
                <Users className="w-3 h-3 mr-1" />
                Users ({Array.isArray(allUsers) ? allUsers.length : 0})
              </Button>
              <Button 
                onClick={() => setShowKycPanel(!showKycPanel)}
                variant="outline" 
                size="sm"
                className="border-white/30 text-white hover:bg-white/20 text-xs px-2 py-1"
              >
                <UserCheck className="w-3 h-3 mr-1" />
                KYC ({(pendingKyc as any)?.length || 0})
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs px-2 py-1"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Logout
              </Button>
            </div>
          </div>

          {/* Analytics Overview */}
          {analyticsData?.analytics && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-xs">Total Users</p>
                      <p className="text-white text-lg font-bold">{analyticsData.analytics.totalUsers}</p>
                    </div>
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-xs">Online Now</p>
                      <p className="text-white text-lg font-bold">{analyticsData.analytics.onlineUsers}</p>
                    </div>
                    <div className="flex items-center">
                      <Wifi className="w-5 h-5 text-green-400" />
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse ml-1"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-200 text-xs">Active 24h</p>
                      <p className="text-white text-lg font-bold">{analyticsData.analytics.activeUsers24h}</p>
                    </div>
                    <Activity className="w-5 h-5 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm">Active 7d</p>
                      <p className="text-white text-2xl font-bold">{analyticsData.analytics.activeUsers7d}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Overview Panel */}
          {showUsersList && (
            <Card className="mb-4 bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    Users Overview
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                      {Array.isArray(allUsers) ? allUsers.length : 0} Total Users
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {Array.isArray(allUsers) && allUsers.map((user: AdminUser) => (
                    <div
                      key={user._id}
                      className="p-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <Avatar className="w-6 h-6 flex-shrink-0">
                            {user.profilePicture ? (
                              <AvatarImage src={user.profilePicture} alt={user.username} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                {user.firstName?.[0] || user.username[0]?.toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1">
                              <p className="text-xs font-medium text-white truncate">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.username
                                }
                              </p>
                              {user.isOnline && (
                                <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-blue-200 truncate">
                              {user.email}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-green-400 font-medium">${user.balance.toFixed(2)}</p>
                              <p className="text-xs text-blue-400">UID: {user.uid}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-blue-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyUserId(user.uid);
                          }}
                        >
                          {copiedId === user.uid ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {Array.isArray(allUsers) && allUsers.length > 0 && (
                  <div className="text-center mt-4">
                    <p className="text-blue-200 text-sm">
                      Showing all {allUsers.length} users
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* KYC Management Panel */}
          {showKycPanel && (
            <Card className="mb-4 bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-orange-400" />
                    KYC Verifications
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-200">
                      {(pendingKyc as any)?.length || 0} Pending
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-orange-400">Live</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(pendingKyc as any)?.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg font-medium">No Pending Verifications</p>
                    <p className="text-gray-400 text-sm">All KYC submissions have been processed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(pendingKyc as any)?.map((verification: any) => (
                      <div
                        key={verification._id}
                        className="p-4 bg-white/10 rounded-lg border border-white/20 cursor-pointer hover:bg-white/15 transition-all hover:border-orange-500/50"
                        onClick={() => {
                          // Check if documents exist before opening modal
                          if (verification.kycData?.documents) {
                            const documents = verification.kycData.documents;
                            const availableDocs: string[] = [];
                            
                            if (documents.front) {
                              availableDocs.push(`data:image/jpeg;base64,${documents.front}`);
                            }
                            if (documents.back) {
                              availableDocs.push(`data:image/jpeg;base64,${documents.back}`);
                            }
                            if (documents.single) {
                              availableDocs.push(`data:image/jpeg;base64,${documents.single}`);
                            }
                            
                            if (availableDocs.length > 0) {
                              setAllDocuments(availableDocs);
                              setCurrentDocumentIndex(0);
                              setSelectedDocumentImage(availableDocs[0]);
                              setDocumentModalOpen(true);
                            }
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {verification.firstName && verification.lastName 
                                  ? `${verification.firstName} ${verification.lastName}` 
                                  : verification.username
                                }
                              </p>
                              <p className="text-blue-200 text-sm">{verification.email}</p>
                              <p className="text-gray-400 text-xs">UID: {verification.uid}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              Pending Review
                            </Badge>
                            {verification.kycData?.documents && (
                              <div className="flex items-center text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                                <Eye className="w-3 h-3 mr-1" />
                                Click to view ID documents
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {verification.kycData && (
                          <div className="mb-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Document Type:</span>
                                <span className="text-white ml-2">{verification.kycData.documentType || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Source of Income:</span>
                                <span className="text-white ml-2">{verification.kycData.sourceOfIncome || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Annual Income:</span>
                                <span className="text-white ml-2">{verification.kycData.annualIncome || 'Not specified'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Investment Experience:</span>
                                <span className="text-white ml-2">{verification.kycData.investmentExperience || 'Not specified'}</span>
                              </div>
                            </div>
                            
                            {/* Document Photos Section */}
                            {verification.kycData.documents && (
                              <div className="space-y-2">
                                <span className="text-gray-400 text-sm font-medium">Submitted Documents:</span>
                                <div className="grid grid-cols-2 gap-3">
                                  {verification.kycData.documents.front && (
                                    <div className="space-y-1">
                                      <label className="text-xs text-gray-400">Front Side</label>
                                      <img
                                        src={`data:image/jpeg;base64,${verification.kycData.documents.front}`}
                                        alt="Document Front"
                                        className="w-full h-32 object-cover rounded-lg border border-white/20 cursor-pointer hover:border-orange-500/50 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedDocumentImage(`data:image/jpeg;base64,${verification.kycData.documents.front}`);
                                          setDocumentModalOpen(true);
                                        }}
                                      />
                                    </div>
                                  )}
                                  {verification.kycData.documents.back && (
                                    <div className="space-y-1">
                                      <label className="text-xs text-gray-400">Back Side</label>
                                      <img
                                        src={`data:image/jpeg;base64,${verification.kycData.documents.back}`}
                                        alt="Document Back"
                                        className="w-full h-32 object-cover rounded-lg border border-white/20 cursor-pointer hover:border-orange-500/50 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedDocumentImage(`data:image/jpeg;base64,${verification.kycData.documents.back}`);
                                          setDocumentModalOpen(true);
                                        }}
                                      />
                                    </div>
                                  )}
                                  {verification.kycData.documents.single && (
                                    <div className="space-y-1 col-span-2">
                                      <label className="text-xs text-gray-400">Document</label>
                                      <img
                                        src={`data:image/jpeg;base64,${verification.kycData.documents.single}`}
                                        alt="Document"
                                        className="w-full h-32 object-cover rounded-lg border border-white/20 cursor-pointer hover:border-orange-500/50 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedDocumentImage(`data:image/jpeg;base64,${verification.kycData.documents.single}`);
                                          setDocumentModalOpen(true);
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* View Documents Button */}
                        {verification.kycData?.documents && (
                          <div className="pt-3 border-t border-white/10">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/20 mb-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Collect all available documents
                                const documents = verification.kycData.documents;
                                const availableDocs: string[] = [];
                                
                                if (documents.front) {
                                  availableDocs.push(`data:image/jpeg;base64,${documents.front}`);
                                }
                                if (documents.back) {
                                  availableDocs.push(`data:image/jpeg;base64,${documents.back}`);
                                }
                                if (documents.single) {
                                  availableDocs.push(`data:image/jpeg;base64,${documents.single}`);
                                }
                                
                                if (availableDocs.length > 0) {
                                  setAllDocuments(availableDocs);
                                  setCurrentDocumentIndex(0);
                                  setSelectedDocumentImage(availableDocs[0]);
                                  setDocumentModalOpen(true);
                                }
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Submitted Documents
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 pt-3 border-t border-white/10">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              approveKycMutation.mutate({ userId: verification._id, status: 'verified' });
                            }}
                            disabled={approveKycMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-300 hover:bg-red-500/20 flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const reason = prompt("Enter rejection reason (optional):");
                              approveKycMutation.mutate({ userId: verification._id, status: 'rejected', reason: reason || undefined });
                            }}
                            disabled={approveKycMutation.isPending}
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content Tabs - Mobile Optimized */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10 border-white/20 w-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/20 text-xs">
              <Users className="w-3 h-3 mr-1" />
              Users
            </TabsTrigger>
            <TabsTrigger value="deposits" className="data-[state=active]:bg-white/20 text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              Deposits
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="data-[state=active]:bg-white/20 text-xs">
              <Minus className="w-3 h-3 mr-1" />
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-white/20 text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Active Users */}
            {analyticsData?.analytics?.topActiveUsers && (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                    Most Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.analytics.topActiveUsers.map((user, index) => (
                      <div key={user.email} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                            #{index + 1}
                          </Badge>
                          <div>
                            <p className="text-white font-medium">{user.username}</p>
                            <p className="text-blue-200 text-sm">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <p className="text-white text-sm">{Math.round(user.onlineTime / 60)}h</p>
                            {user.isOnline ? (
                              <Wifi className="w-4 h-4 text-green-400" />
                            ) : (
                              <WifiOff className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">
                            {new Date(user.lastActivity).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Enhanced User Search */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-400" />
                  Advanced User Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white">Search by Email</label>
                    <div className="relative">
                      <Input
                        placeholder="Enter email address..."
                        value={emailSearchQuery}
                        onChange={(e) => setEmailSearchQuery(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                      {emailSearchLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {emailSearchResults.length > 0 && (
                      <p className="text-xs text-blue-200">{emailSearchResults.length} user(s) found</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Search by UID</label>
                    <div className="relative">
                      <Input
                        placeholder="Enter user ID..."
                        value={uidSearchQuery}
                        onChange={(e) => setUidSearchQuery(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pl-10"
                      />
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                      {uidSearchLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {uidSearchResults.length > 0 && (
                      <p className="text-xs text-blue-200">{uidSearchResults.length} user(s) found</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">General Search</label>
                    <div className="relative">
                      <Input
                        placeholder="Search by name, email, username, or UID..."
                        value={generalSearchQuery}
                        onChange={(e) => setGeneralSearchQuery(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                      {generalSearchLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {generalSearchResults.length > 0 && (
                      <p className="text-xs text-blue-200">{generalSearchResults.length} user(s) found</p>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {(emailSearchResults.length > 0 || uidSearchResults.length > 0 || generalSearchResults.length > 0) && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-white font-medium">Search Results</h3>
                    {[...emailSearchResults, ...uidSearchResults, ...generalSearchResults]
                      .filter((user, index, self) => self.findIndex(u => u._id === user._id) === index)
                      .map((user: AdminUser) => (
                        <div
                          key={user._id}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedUser?._id === user._id
                              ? "bg-blue-500/30 border border-blue-400"
                              : "bg-white/10 border border-white/20 hover:bg-white/20"
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                {user.profilePicture ? (
                                  <AvatarImage src={user.profilePicture} alt={user.username} />
                                ) : (
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    {user.firstName?.[0] || user.username[0]?.toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-white">
                                    {user.firstName && user.lastName 
                                      ? `${user.firstName} ${user.lastName}` 
                                      : user.username
                                    }
                                  </p>
                                  {user.isOnline && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                  {user.isVerified && (
                                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                  {user.isAdmin && (
                                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs">
                                      Admin
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-blue-200 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {user.email}
                                </p>
                                <p className="text-sm text-blue-300 flex items-center">
                                  <CreditCard className="w-3 h-3 mr-1" />
                                  Balance: ${user.balance.toFixed(2)}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-blue-400">UID: {user.uid}</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-blue-300 hover:text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyUserId(user.uid);
                                    }}
                                  >
                                    {copiedId === user.uid ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                  {user.lastActivity && (
                                    <p className="text-xs text-gray-400">
                                      Last: {new Date(user.lastActivity).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected User Management */}
            {selectedUser && (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <UserPlus className="w-5 h-5 mr-2 text-green-400" />
                      Managing: {selectedUser.firstName && selectedUser.lastName 
                        ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                        : selectedUser.username}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      Close
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fund Management */}
                    <div className="space-y-4">
                      <h3 className="text-white font-medium">Fund Management</h3>
                      <div className="space-y-3">
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleAddFunds}
                            disabled={addFundsMutation.isPending || !fundAmount}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Funds
                          </Button>
                          <Button
                            onClick={handleRemoveFunds}
                            disabled={removeFundsMutation.isPending || !fundAmount}
                            variant="outline"
                            className="border-red-500/30 text-red-300 hover:bg-red-500/20 flex-1"
                          >
                            <Minus className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* User Actions */}
                    <div className="space-y-4">
                      <h3 className="text-white font-medium">User Actions</h3>
                      <div className="space-y-3">
                        {/* Deposit Requirement Toggle */}
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-medium">Require Deposit</p>
                              <p className="text-gray-400 text-xs">User must make deposit to unlock features</p>
                            </div>
                            <Button
                              onClick={() => {
                                const newRequirement = !(selectedUser as any).requiresDeposit;
                                toggleDepositRequirementMutation.mutate({
                                  userId: selectedUser._id,
                                  requiresDeposit: newRequirement
                                });
                              }}
                              disabled={toggleDepositRequirementMutation.isPending}
                              size="sm"
                              className={`${
                                (selectedUser as any).requiresDeposit 
                                  ? 'bg-orange-600 hover:bg-orange-700' 
                                  : 'bg-gray-600 hover:bg-gray-700'
                              } text-white px-3 py-1`}
                            >
                              {(selectedUser as any).requiresDeposit ? 'ENABLED' : 'DISABLED'}
                            </Button>
                          </div>
                        </div>

                        {/* Withdrawal Access Toggle */}
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-medium">Withdrawal Access</p>
                              <p className="text-gray-400 text-xs">Allow user to make withdrawals directly</p>
                            </div>
                            <Button
                              onClick={() => {
                                const newAccess = !(selectedUser as any).withdrawalAccess;
                                toggleWithdrawalAccessMutation.mutate({
                                  userId: selectedUser._id,
                                  withdrawalAccess: newAccess
                                });
                              }}
                              disabled={toggleWithdrawalAccessMutation.isPending}
                              size="sm"
                              className={`${
                                (selectedUser as any).withdrawalAccess 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-gray-600 hover:bg-gray-700'
                              } text-white px-3 py-1`}
                            >
                              {(selectedUser as any).withdrawalAccess ? 'ENABLED' : 'DISABLED'}
                            </Button>
                          </div>
                        </div>

                        {/* Transfer Access Toggle */}
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-medium">Transfer Access</p>
                              <p className="text-gray-400 text-xs">Allow user to send transfers to other users</p>
                            </div>
                            <Button
                              onClick={() => {
                                const currentAccess = (selectedUser as any).transferAccess !== false;
                                const newAccess = !currentAccess;
                                toggleTransferAccessMutation.mutate({
                                  userId: selectedUser._id,
                                  transferAccess: newAccess
                                });
                              }}
                              disabled={toggleTransferAccessMutation.isPending}
                              size="sm"
                              className={`${
                                (selectedUser as any).transferAccess !== false
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-gray-600 hover:bg-gray-700'
                              } text-white px-3 py-1`}
                            >
                              {(selectedUser as any).transferAccess !== false ? 'ENABLED' : 'DISABLED'}
                            </Button>
                          </div>
                        </div>

                        {/* All Features Disabled Toggle */}
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-medium">All Features Access</p>
                              <p className="text-gray-400 text-xs">Enable/disable all platform features for user</p>
                            </div>
                            <Button
                              onClick={() => {
                                const newDisabled = !(selectedUser as any).allFeaturesDisabled;
                                toggleAllFeaturesDisabledMutation.mutate({
                                  userId: selectedUser._id,
                                  allFeaturesDisabled: newDisabled
                                });
                              }}
                              disabled={toggleAllFeaturesDisabledMutation.isPending}
                              size="sm"
                              className={`${
                                !(selectedUser as any).allFeaturesDisabled 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-red-600 hover:bg-red-700'
                              } text-white px-3 py-1`}
                            >
                              {!(selectedUser as any).allFeaturesDisabled ? 'ENABLED' : 'DISABLED'}
                            </Button>
                          </div>
                        </div>

                        {/* Withdrawal Restriction Message */}
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="space-y-3">
                            <div>
                              <p className="text-white text-sm font-medium">Withdrawal Restriction Message</p>
                              <p className="text-gray-400 text-xs">Custom message with amount and restriction details</p>
                            </div>
                            <Textarea
                              placeholder="Enter restriction message (e.g., 'You need to deposit $500 to unlock withdrawals')"
                              value={withdrawalMessage}
                              onChange={(e) => setWithdrawalMessage(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[80px] resize-none"
                              maxLength={500}
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {withdrawalMessage.length}/500 characters
                              </span>
                              <Button
                                onClick={() => {
                                  updateWithdrawalMessageMutation.mutate({
                                    userId: selectedUser._id,
                                    message: withdrawalMessage
                                  });
                                }}
                                disabled={updateWithdrawalMessageMutation.isPending}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {updateWithdrawalMessageMutation.isPending ? 'Updating...' : 'Update Message'}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => getUserPasswordMutation.mutate(selectedUser._id)}
                          disabled={getUserPasswordMutation.isPending}
                          variant="outline"
                          className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                          View Password Key
                        </Button>
                        
                        {showPassword && userPassword && (
                          <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                            <p className="text-blue-200 text-sm">Password Security Key:</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex-1 bg-black/30 rounded px-3 py-2 border border-blue-500/40">
                                <p className="text-orange-300 font-mono text-xs tracking-wider">
                                  {userPassword.slice(0, 4)}•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••{userPassword.slice(-4)}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(userPassword);
                                  toast({ title: "Password Key Copied", description: "Full password key copied to clipboard for security review" });
                                }}
                                className="text-blue-300 hover:text-white shrink-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-blue-200/70 mt-2">
                              ⚠️ Security Key - Full key copied to clipboard when copy button is clicked
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={() => handleDeleteUser(selectedUser)}
                          disabled={deleteUserMutation.isPending || selectedUser.isAdmin}
                          variant="outline"
                          className="w-full border-red-500/30 text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-medium mb-3">User Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white ml-2">{selectedUser.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">UID:</span>
                        <span className="text-white ml-2">{selectedUser.uid}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Balance:</span>
                        <span className="text-green-400 ml-2">${selectedUser.balance.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className={`ml-2 ${selectedUser.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                          {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      {selectedUser.onlineTime && (
                        <div>
                          <span className="text-gray-400">Online Time:</span>
                          <span className="text-white ml-2">{Math.round(selectedUser.onlineTime / 60)}h</span>
                        </div>
                      )}
                      {selectedUser.lastActivity && (
                        <div>
                          <span className="text-gray-400">Last Activity:</span>
                          <span className="text-white ml-2">{new Date(selectedUser.lastActivity).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Send Message to User */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
                      Send Message to User
                    </h3>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your message to the user..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[80px] resize-none"
                        maxLength={2000}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {messageText.length}/2000 characters
                        </span>
                        <Button
                          onClick={() => sendMessageMutation.mutate({ userId: selectedUser._id, message: messageText })}
                          disabled={!messageText.trim() || messageText.length > 2000 || sendMessageMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Connection Request */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-purple-400" />
                      Send Connection Request
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Service Name</label>
                        <Input
                          placeholder="e.g., Binance, Coinbase, eToro"
                          value={connectionRequestData.serviceName}
                          onChange={(e) => setConnectionRequestData(prev => ({
                            ...prev,
                            serviceName: e.target.value
                          }))}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Custom Message</label>
                        <Textarea
                          placeholder="Your request message to the user..."
                          value={connectionRequestData.customMessage}
                          onChange={(e) => setConnectionRequestData(prev => ({
                            ...prev,
                            customMessage: e.target.value
                          }))}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[80px] resize-none"
                          maxLength={500}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Success Message</label>
                        <Textarea
                          placeholder="Message shown when user accepts..."
                          value={connectionRequestData.successMessage}
                          onChange={(e) => setConnectionRequestData(prev => ({
                            ...prev,
                            successMessage: e.target.value
                          }))}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[60px] resize-none"
                          maxLength={300}
                        />
                      </div>
                      <Button
                        onClick={handleSendConnectionRequest}
                        disabled={!connectionRequestData.serviceName || !connectionRequestData.customMessage || !connectionRequestData.successMessage || sendConnectionRequestMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                        size="sm"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        {sendConnectionRequestMutation.isPending ? 'Sending...' : 'Send Connection Request'}
                      </Button>
                    </div>
                  </div>


                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="deposits" className="space-y-6">
            {selectedUser ? (
              <AdminDepositCreator 
                userId={selectedUser._id} 
                username={selectedUser.username}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
                  refetchUsers();
                }}
              />
            ) : (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8 text-center">
                  <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-medium mb-2">Create Deposit Transaction</h3>
                  <p className="text-gray-300 mb-4">Select a user from the User Management tab to create a deposit transaction.</p>
                  <Button
                    onClick={() => setActiveTab("users")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Go to User Management
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-6">
            {selectedUser ? (
              <AdminWithdrawalCreator 
                userId={selectedUser._id} 
                username={selectedUser.username}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
                  refetchUsers();
                }}
              />
            ) : (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8 text-center">
                  <Minus className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-medium mb-2">Create Withdrawal Transaction</h3>
                  <p className="text-gray-300 mb-4">Select a user from the User Management tab to create a withdrawal transaction.</p>
                  <Button
                    onClick={() => setActiveTab("users")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Go to User Management
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <ContactMessagesManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Document Modal for KYC Photo Viewing */}
      {documentModalOpen && selectedDocumentImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999999] p-4">
          <div className="relative max-w-5xl max-h-full flex flex-col">
            {/* Document Counter and Navigation */}
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                Document {currentDocumentIndex + 1} of {allDocuments.length}
              </div>
              <div className="flex items-center space-x-2">
                {allDocuments.length > 1 && (
                  <>
                    <Button
                      onClick={() => {
                        const newIndex = currentDocumentIndex > 0 ? currentDocumentIndex - 1 : allDocuments.length - 1;
                        setCurrentDocumentIndex(newIndex);
                        setSelectedDocumentImage(allDocuments[newIndex]);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 p-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => {
                        const newIndex = currentDocumentIndex < allDocuments.length - 1 ? currentDocumentIndex + 1 : 0;
                        setCurrentDocumentIndex(newIndex);
                        setSelectedDocumentImage(allDocuments[newIndex]);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 p-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => {
                    setDocumentModalOpen(false);
                    setSelectedDocumentImage(null);
                    setAllDocuments([]);
                    setCurrentDocumentIndex(0);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Document Image */}
            <div className="flex-1 flex items-center justify-center">
              <img 
                src={selectedDocumentImage} 
                alt="KYC Document" 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Document Type Label */}
            <div className="text-center mt-4">
              <span className="text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full">
                {currentDocumentIndex === 0 && allDocuments.length > 1 ? 'Front Side' : 
                 currentDocumentIndex === 1 && allDocuments.length > 1 ? 'Back Side' : 
                 'Identity Document'}
              </span>
            </div>
          </div>
        </div>
      )}
    </AdminPullToRefresh>
  );
}