import { useState } from "react";
import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  isHomePage?: boolean;
}

export const SearchInterface = ({ onSearch, isLoading, isHomePage = false }: SearchInterfaceProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`search-container ${isHomePage ? "max-w-3xl" : "max-w-2xl"}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-6 h-5 w-5 text-muted-foreground z-10" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything or search through documents..."
            className={`search-input pl-14 pr-16 ${isHomePage ? "py-5 text-xl" : "py-4 text-lg"}`}
            disabled={isLoading}
            autoFocus
          />
          
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 h-12 w-12 rounded-full p-0 button-primary"
          >
            {isLoading ? (
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
      
      {isHomePage && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            onClick={() => query.trim() && onSearch(query.trim())}
            disabled={!query.trim() || isLoading}
            className="button-primary"
          >
            Search
          </Button>
          <Button
            type="button"
            onClick={() => onSearch("Tell me something interesting")}
            disabled={isLoading}
            className="button-secondary"
          >
            I'm Feeling Curious
          </Button>
        </div>
      )}
    </div>
  );
};