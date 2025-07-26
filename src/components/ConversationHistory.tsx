import { useState } from "react";
import { History, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  query: string;
  timestamp: Date;
  preview: string;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onClearHistory: () => void;
  currentConversationId?: string;
}

export const ConversationHistory = ({ 
  conversations, 
  onSelectConversation, 
  onClearHistory,
  currentConversationId 
}: ConversationHistoryProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border h-full flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="m-2 h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-2 pt-4">
          <History className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">History</h3>
          </div>
          <div className="flex items-center gap-1">
            {conversations.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Your search history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Button
                  key={conversation.id}
                  variant="ghost"
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-3 h-auto text-left justify-start ${
                    currentConversationId === conversation.id 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div className="space-y-1 text-left">
                    <p className="text-sm font-medium line-clamp-2">
                      {conversation.query}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {conversation.preview}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};