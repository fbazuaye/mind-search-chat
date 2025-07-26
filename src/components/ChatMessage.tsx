import { Bot, User, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Source {
  title?: string;
  url?: string;
  snippet?: string;
}

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  sources?: Source[];
  timestamp?: Date;
}

export const ChatMessage = ({ message, isUser, sources, timestamp }: ChatMessageProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "Copied to clipboard",
        description: "Message copied successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`chat-message ${isUser ? "user" : "ai"} slide-up`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-accent text-accent-foreground"
        }`}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          </div>
          
          {sources && sources.length > 0 && (
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Sources:</h4>
              <div className="space-y-2">
                {sources.map((source, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    {source.url ? (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {source.title || source.url}
                      </a>
                    ) : (
                      <span className="text-foreground">{source.title || `Source ${index + 1}`}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            {timestamp && (
              <span className="text-xs text-muted-foreground">
                {timestamp.toLocaleTimeString()}
              </span>
            )}
            
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};