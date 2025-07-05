import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Mail, 
  User, 
  Clock, 
  Eye, 
  Trash2, 
  Filter,
  AlertCircle,
  CheckCircle,
  Loader2,
  Reply,
  Send
} from "lucide-react";

interface ContactMessage {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  category: 'general' | 'support' | 'security' | 'technical';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  adminReply?: string;
  adminReplyAt?: string;
  hasReply: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
    profilePicture?: string;
  };
}

interface ContactMessagesResponse {
  success: boolean;
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    unread: number;
    read: number;
  };
}

export default function ContactMessagesManager() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contact messages
  const { data: messagesData, isLoading, refetch } = useQuery<ContactMessagesResponse>({
    queryKey: ['/api/admin/contact-messages', filter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/contact-messages?filter=${filter}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      return response.json();
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/admin/contact-messages/${messageId}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-messages'] });
      toast({
        title: "Message Marked as Read",
        description: "The message has been marked as read successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-messages'] });
      setSelectedMessage(null);
      toast({
        title: "Message Deleted",
        description: "The message has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reply to message mutation
  const replyMutation = useMutation({
    mutationFn: async ({ messageId, reply }: { messageId: string; reply: string }) => {
      const response = await fetch(`/api/admin/contact-messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ reply }),
      });
      if (!response.ok) {
        throw new Error('Failed to send reply');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-messages'] });
      setShowReplyDialog(false);
      setReplyText('');
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the user successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    replyMutation.mutate({ messageId: selectedMessage._id, reply: replyText.trim() });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'support': return <MessageSquare className="w-4 h-4" />;
      case 'security': return <AlertCircle className="w-4 h-4" />;
      case 'technical': return <CheckCircle className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur border-white/20">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading contact messages...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Filters */}
      <Card className="bg-white/10 backdrop-blur border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Contact Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{messagesData?.stats.total || 0}</div>
              <div className="text-sm text-gray-300">Total Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{messagesData?.stats.unread || 0}</div>
              <div className="text-sm text-gray-300">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{messagesData?.stats.read || 0}</div>
              <div className="text-sm text-gray-300">Read</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              All Messages
            </Button>
            <Button
              onClick={() => setFilter('unread')}
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              Unread ({messagesData?.stats.unread || 0})
            </Button>
            <Button
              onClick={() => setFilter('read')}
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              Read ({messagesData?.stats.read || 0})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List Panel */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto space-y-3">
            {messagesData?.messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">No messages found</p>
              </div>
            ) : (
              messagesData?.messages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-white/5 ${
                    message.isRead 
                      ? 'border-white/20 bg-white/5' 
                      : 'border-orange-400/50 bg-orange-400/10'
                  } ${
                    selectedMessage?._id === message._id ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.user?.profilePicture} />
                        <AvatarFallback className="text-xs">
                          {message.firstName[0]}{message.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {message.firstName} {message.lastName}
                        </div>
                        <div className="text-gray-400 text-xs">{message.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      )}
                      <Badge className={getPriorityColor(message.priority)}>
                        {message.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(message.category)}
                    <span className="text-gray-300 text-sm capitalize">{message.category}</span>
                  </div>
                  
                  <div className="text-white text-sm font-medium mb-1 truncate">
                    {message.subject}
                  </div>
                  
                  <div className="text-gray-300 text-xs line-clamp-2 mb-2">
                    {message.message}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                    {message.user?.username && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{message.user.username}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Message Detail Panel */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                {/* Message Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedMessage.user?.profilePicture} />
                      <AvatarFallback>
                        {selectedMessage.firstName[0]}{selectedMessage.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-white font-medium">
                        {selectedMessage.firstName} {selectedMessage.lastName}
                      </div>
                      <div className="text-gray-400 text-sm">{selectedMessage.email}</div>
                      {selectedMessage.user?.username && (
                        <div className="text-gray-400 text-xs">@{selectedMessage.user.username}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {selectedMessage.priority}
                    </Badge>
                    {!selectedMessage.isRead && (
                      <Badge className="bg-orange-100 text-orange-800">
                        Unread
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-300 text-sm mb-1">Category</div>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(selectedMessage.category)}
                      <span className="text-white capitalize">{selectedMessage.category}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-300 text-sm mb-1">Subject</div>
                    <div className="text-white font-medium">{selectedMessage.subject}</div>
                  </div>

                  <div>
                    <div className="text-gray-300 text-sm mb-1">Message</div>
                    <div className="text-white bg-white/5 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {/* Admin Reply Section */}
                  {selectedMessage.hasReply && selectedMessage.adminReply && (
                    <div>
                      <div className="text-gray-300 text-sm mb-1 flex items-center">
                        <Reply className="w-4 h-4 mr-1" />
                        Your Reply
                        {selectedMessage.adminReplyAt && (
                          <span className="ml-2 text-xs text-gray-400">
                            • {formatDate(selectedMessage.adminReplyAt)}
                          </span>
                        )}
                      </div>
                      <div className="text-white bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedMessage.adminReply}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-300 mb-1">Received</div>
                      <div className="text-white">{formatDate(selectedMessage.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-gray-300 mb-1">Last Updated</div>
                      <div className="text-white">{formatDate(selectedMessage.updatedAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                  <Button
                    onClick={() => setShowReplyDialog(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply to User
                  </Button>
                  {!selectedMessage.isRead && (
                    <Button
                      onClick={() => markAsReadMutation.mutate(selectedMessage._id)}
                      disabled={markAsReadMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      {markAsReadMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteMessageMutation.mutate(selectedMessage._id)}
                    disabled={deleteMessageMutation.isPending}
                    variant="destructive"
                    size="sm"
                  >
                    {deleteMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Message Selected</h3>
                <p className="text-gray-300">Select a message from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="max-w-md bg-gradient-to-br from-[#0a0a2e] to-[#1a1a40] border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Reply className="h-5 w-5" />
              Send Reply
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-gray-300 text-sm">Replying to:</div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white font-medium text-sm">{selectedMessage.subject}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    From: {selectedMessage.firstName} {selectedMessage.lastName}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-gray-300 text-sm">Your Reply:</div>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px] resize-none"
                  maxLength={5000}
                />
                <div className="text-xs text-gray-400 text-right">
                  {replyText.length}/5000
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReplyDialog(false);
                    setReplyText('');
                  }}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={replyMutation.isPending || !replyText.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {replyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}