import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MessageSquare } from "lucide-react";

interface UserContactMessage {
  _id: string;
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
}

interface UserMessageBoxProps {
  className?: string;
}

export default function UserMessageBox({ className = "" }: UserMessageBoxProps) {
  // Fetch user's contact messages
  const { data: messagesData } = useQuery<{ success: boolean; data: UserContactMessage[] }>({
    queryKey: ['/api/user/contact-messages'],
    queryFn: async () => {
      const response = await fetch('/api/user/contact-messages', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const messages = messagesData?.data || [];
  const unreadReplies = messages.filter(m => m.hasReply && !m.isRead).length;

  return (
    <div className={`relative ${className}`}>
      <Link href="/mobile/messages">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-white hover:bg-white/10 relative"
        >
          <MessageSquare className="h-5 w-5" />
          {unreadReplies > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadReplies}
            </span>
          )}
        </Button>
      </Link>
    </div>
  );
}