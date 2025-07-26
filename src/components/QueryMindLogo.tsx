import { Brain, Search } from "lucide-react";

interface QueryMindLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const QueryMindLogo = ({ size = "md", showText = true }: QueryMindLogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl"
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center">
          <div className="relative">
            <Brain className={`${size === 'lg' ? 'h-8 w-8' : size === 'md' ? 'h-6 w-6' : 'h-4 w-4'} text-white`} />
            <Search className={`${size === 'lg' ? 'h-4 w-4' : size === 'md' ? 'h-3 w-3' : 'h-2 w-2'} text-white absolute -bottom-1 -right-1`} />
          </div>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-foreground`}>
            QueryMind
          </h1>
          {size !== "sm" && (
            <p className="text-sm text-muted-foreground -mt-1">
              AI-Powered Search & Chat
            </p>
          )}
        </div>
      )}
    </div>
  );
};