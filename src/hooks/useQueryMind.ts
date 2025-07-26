import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

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

  const FLOWISE_ENDPOINT = "https://livegigaichatbot.onrender.com/api/v1/prediction/300308c0-f14d-4ff1-a0a3-075c245eb74a";

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
    
    // Parse the response based on Flowise RAG format
    // Adjust this based on your actual Flowise response structure
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

      // Query Flowise
      const response = await queryFlowise(query);
      
      // Add AI response
      addMessage(conversation, response.text, false, response.sources);

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

  const clearHistory = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
  }, []);

  return {
    conversations,
    currentConversation,
    isLoading,
    handleQuery,
    selectConversation,
    startNewConversation,
    clearHistory,
  };
};