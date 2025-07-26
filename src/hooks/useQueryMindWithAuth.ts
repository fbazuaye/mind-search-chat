import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface QueryResponse {
  text: string;
  sources?: Array<{
    title?: string;
    url?: string;
    snippet?: string;
  }>;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: QueryResponse['sources'];
}

interface Conversation {
  id: string;
  query: string;
  timestamp: Date;
  preview: string;
  messages: Message[];
}

export const useQueryMind = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const FLOWISE_ENDPOINT = "https://livegigaichatbot.onrender.com/api/v1/prediction/300308c0-f14d-4ff1-a0a3-075c245eb74a";

  // Load conversation history from Supabase on user login
  useEffect(() => {
    if (user) {
      loadConversationHistory();
    }
  }, [user]);

  const loadConversationHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group messages into conversations
      const conversationsMap = new Map<string, Conversation>();
      
      for (let i = 0; i < data.length; i += 2) {
        const userMessage = data[i];
        const aiMessage = data[i + 1];
        
        if (userMessage && aiMessage && userMessage.is_user) {
          const conversationId = userMessage.id;
          const conversation: Conversation = {
            id: conversationId,
            query: userMessage.content,
            timestamp: new Date(userMessage.created_at),
            preview: userMessage.content.length > 50 ? userMessage.content.substring(0, 50) + "..." : userMessage.content,
            messages: [
              {
                id: userMessage.id,
                content: userMessage.content,
                isUser: true,
                timestamp: new Date(userMessage.created_at)
              },
              {
                id: aiMessage.id,
                content: aiMessage.content,
                isUser: false,
                timestamp: new Date(aiMessage.created_at)
              }
            ]
          };
          conversationsMap.set(conversationId, conversation);
        }
      }
      
      setConversations(Array.from(conversationsMap.values()).reverse());
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const saveMessageToDatabase = async (content: string, isUser: boolean, conversationId?: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          content,
          is_user: isUser
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const queryFlowise = async (question: string): Promise<QueryResponse> => {
    const response = await fetch(FLOWISE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      text: data.text || data.answer || data.response || "No response received",
      sources: data.sources || data.sourceDocuments || [],
    };
  };

  const createNewConversation = useCallback((query: string): Conversation => {
    const id = Date.now().toString();
    return {
      id,
      query,
      timestamp: new Date(),
      preview: query.length > 50 ? query.substring(0, 50) + "..." : query,
      messages: [],
    };
  }, []);

  const addMessage = useCallback((conversation: Conversation, content: string, isUser: boolean, sources?: QueryResponse['sources']): Message => {
    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      isUser,
      timestamp: new Date(),
      sources,
    };

    conversation.messages.push(message);
    return message;
  }, []);

  const handleQuery = useCallback(async (query: string) => {
    setIsLoading(true);
    
    try {
      // Create new conversation or use current one
      let conversation = currentConversation;
      if (!conversation) {
        conversation = createNewConversation(query);
        setCurrentConversation(conversation);
      }

      // Add user message
      addMessage(conversation, query, true);

      // Update conversations list
      setConversations(prev => {
        const existing = prev.find(c => c.id === conversation!.id);
        if (existing) {
          return prev.map(c => c.id === conversation!.id ? conversation! : c);
        }
        return [conversation!, ...prev];
      });

      // Save user message to database
      await saveMessageToDatabase(query, true);

      // Query Flowise
      const response = await queryFlowise(query);
      
      // Add AI response
      addMessage(conversation, response.text, false, response.sources);

      // Save AI response to database
      await saveMessageToDatabase(response.text, false);

      // Update conversation
      setCurrentConversation({ ...conversation });
      setConversations(prev => 
        prev.map(c => c.id === conversation!.id ? conversation! : c)
      );

      toast({
        title: "Query completed",
        description: "Response received successfully",
      });

    } catch (error) {
      console.error("Query error:", error);
      
      const errorMessage = error instanceof Error 
        ? `Sorry, I encountered an error: ${error.message}` 
        : "Sorry, I encountered an unexpected error. Please try again.";

      if (currentConversation) {
        addMessage(currentConversation, errorMessage, false);
        setCurrentConversation({ ...currentConversation });
      }

      toast({
        title: "Query failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, createNewConversation, addMessage, toast]);

  const selectConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  const startNewConversation = useCallback(() => {
    setCurrentConversation(null);
  }, []);

  const clearHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      setConversations([]);
      setCurrentConversation(null);
      
      toast({
        title: "History cleared",
        description: "Your conversation history has been deleted.",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error",
        description: "Failed to clear conversation history.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  return {
    conversations,
    currentConversation,
    isLoading,
    handleQuery,
    selectConversation,
    startNewConversation,
    clearHistory,
    loadConversationHistory,
  };
};