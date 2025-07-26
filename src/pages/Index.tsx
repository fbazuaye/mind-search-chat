import { QueryMindLogo } from "@/components/QueryMindLogo";
import { SearchInterface } from "@/components/SearchInterface";
import { ChatMessage } from "@/components/ChatMessage";
import { ConversationHistory } from "@/components/ConversationHistory";
import { useQueryMind } from "@/hooks/useQueryMind";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const {
    conversations,
    currentConversation,
    isLoading,
    handleQuery,
    selectConversation,
    startNewConversation,
    clearHistory,
  } = useQueryMind();

  const isHomePage = !currentConversation || currentConversation.messages.length === 0;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Conversation History Sidebar */}
      <ConversationHistory
        conversations={conversations}
        onSelectConversation={selectConversation}
        onClearHistory={clearHistory}
        currentConversationId={currentConversation?.id}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <QueryMindLogo size="sm" />
            
            {currentConversation && (
              <Button
                onClick={startNewConversation}
                className="button-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Search
              </Button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {isHomePage ? (
            /* Homepage Layout */
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center max-w-4xl mx-auto">
                <div className="mb-12">
                  <QueryMindLogo size="lg" />
                  <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
                    Your intelligent search companion. Ask questions, get comprehensive answers 
                    with citations from reliable sources.
                  </p>
                </div>
                
                <SearchInterface
                  onSearch={handleQuery}
                  isLoading={isLoading}
                  isHomePage={true}
                />
                
                <div className="mt-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Designed by <span className="font-medium">Frank Bazuaye</span> • 
                    Powered by <span className="font-medium">LiveGig Ltd</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Layout */
            <div className="flex-1 flex flex-col">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                  {currentConversation?.messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message.content}
                      isUser={message.isUser}
                      sources={message.sources}
                      timestamp={message.timestamp}
                    />
                  ))}
                  
                  {isLoading && (
                    <div className="chat-message ai">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                          <div className="loading-dots">
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                        <span className="text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Search Input */}
              <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
                <SearchInterface
                  onSearch={handleQuery}
                  isLoading={isLoading}
                  isHomePage={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
