import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { ArrowLeft, MessageSquare, Clock, User, Eye, EyeOff, Reply, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  isRead: boolean;
  hasReply: boolean;
  adminReply?: string;
  adminReplyAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    profilePicture?: string;
    username?: string;
  };
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Fetch user's contact messages
  const { data: messagesResponse, isLoading } = useQuery<{ success: boolean; data: ContactMessage[] }>({
    queryKey: ['/api/user/contact-messages'],
    enabled: !!user,
  });

  const messages = messagesResponse?.data || [];

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/user/contact-messages/${messageId}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read successfully.",
      });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case 'billing': return <MessageSquare className="w-4 h-4 text-green-400" />;
      case 'general': return <User className="w-4 h-4 text-gray-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a2e] text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-white/10">
        <Link href="/mobile">
          <Button variant="ghost" size="sm" className="mr-2 text-white hover:bg-white/10 p-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-semibold">Messages</h1>
          <p className="text-xs text-gray-400">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Messages List */}
        <div className="w-full lg:w-1/2 border-r border-white/10">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No Messages</h3>
                  <p className="text-gray-300 mb-4">You haven't sent any contact messages yet.</p>
                  <Link href="/company/contact">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Send Message
                    </Button>
                  </Link>
                </div>
              ) : (
                messages.map((message: ContactMessage) => (
                  <Card
                    key={message._id}
                    className={`cursor-pointer transition-all duration-200 border-white/20 ${
                      selectedMessage?._id === message._id
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(message.category)}
                          <span className="text-gray-300 text-xs capitalize">{message.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!message.isRead && (
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          )}
                          <Badge className={`${getPriorityColor(message.priority)} text-xs px-1 py-0`}>
                            {message.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-white text-xs font-medium mb-1 truncate">
                        {message.subject}
                      </div>
                      
                      <div className="text-gray-300 text-xs line-clamp-1 mb-2">
                        {message.message}
                      </div>
                      
                      {message.hasReply && message.adminReply && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-1.5 mb-2">
                          <div className="flex items-center space-x-1 mb-1">
                            <Reply className="w-2.5 h-2.5 text-blue-400" />
                            <span className="text-blue-400 text-xs font-medium">Message from Support</span>
                          </div>
                          <div className="text-gray-300 text-xs line-clamp-1">
                            {message.adminReply}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span className="text-xs">{formatDate(message.createdAt)}</span>
                        </div>
                        {message.hasReply && (
                          <div className="flex items-center space-x-1 text-blue-400">
                            <Reply className="w-2.5 h-2.5" />
                            <span className="text-xs">Replied</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Message Details */}
        <div className="w-full lg:w-1/2">
          <ScrollArea className="h-full">
            {selectedMessage ? (
              <div className="p-3">
                <Card className="bg-white/5 border-white/20">
                  <CardContent className="p-3">
                    {/* Message Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={selectedMessage.user?.profilePicture} />
                          <AvatarFallback className="bg-orange-500 text-white text-xs">
                            {selectedMessage.firstName[0]}{selectedMessage.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {selectedMessage.firstName} {selectedMessage.lastName}
                          </div>
                          <div className="text-gray-400 text-xs">{selectedMessage.email}</div>
                        </div>
                      </div>
                      <Badge className={`${getPriorityColor(selectedMessage.priority)} text-xs px-1 py-0`}>
                        {selectedMessage.priority}
                      </Badge>
                    </div>

                    {/* Subject */}
                    <div className="mb-3">
                      <div className="text-gray-300 text-xs mb-1">Subject</div>
                      <div className="text-white text-sm font-medium">{selectedMessage.subject}</div>
                    </div>

                    {/* Original Message */}
                    <div className="mb-4">
                      <div className="text-gray-300 text-xs mb-1">Message</div>
                      <div className="bg-white/5 rounded-md p-2 text-white text-sm whitespace-pre-wrap max-h-24 overflow-y-auto">
                        {selectedMessage.message}
                      </div>
                    </div>

                    {/* Support Reply */}
                    {selectedMessage.hasReply && selectedMessage.adminReply && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-1 mb-1">
                          <Reply className="w-3 h-3 text-blue-400" />
                          <div className="text-blue-400 text-xs font-medium">Message from Support</div>
                          <div className="text-gray-400 text-xs">
                            {selectedMessage.adminReplyAt && formatDate(selectedMessage.adminReplyAt)}
                          </div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-2 text-white text-sm whitespace-pre-wrap max-h-24 overflow-y-auto">
                          {selectedMessage.adminReply}
                        </div>
                      </div>
                    )}

                    {/* Message Info */}
                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/20 pt-3">
                      <div>
                        <div className="text-gray-300 mb-1">Category</div>
                        <div className="text-white capitalize">{selectedMessage.category}</div>
                      </div>
                      <div>
                        <div className="text-gray-300 mb-1">Status</div>
                        <div className="flex items-center space-x-1">
                          {selectedMessage.isRead ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-white">
                            {selectedMessage.isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-300 mb-1">Sent</div>
                        <div className="text-white">{formatDate(selectedMessage.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-gray-300 mb-1">Last Updated</div>
                        <div className="text-white">{formatDate(selectedMessage.updatedAt)}</div>
                      </div>
                    </div>

                    {/* Mark as Read Button */}
                    {!selectedMessage.isRead && (
                      <div className="pt-4 border-t border-white/20 mt-4">
                        <Button
                          onClick={() => markAsReadMutation.mutate(selectedMessage._id)}
                          disabled={markAsReadMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {markAsReadMutation.isPending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          ) : (
                            <Eye className="w-4 h-4 mr-2" />
                          )}
                          Mark as Read
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">Select a Message</h3>
                  <p className="text-gray-300">Choose a message from the list to view details</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}