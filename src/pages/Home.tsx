import { QueryMindLogo } from "@/components/QueryMindLogo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Brain, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <QueryMindLogo size="sm" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your intelligent search companion. Ask questions, get comprehensive answers 
              with citations from reliable sources. Powered by advanced RAG technology.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              <Search className="w-5 h-5 mr-2" />
              Start Searching
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              <Brain className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Smart Search</h3>
              <p className="text-muted-foreground">
                Advanced search capabilities with natural language understanding
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">AI-Generated Answers</h3>
              <p className="text-muted-foreground">
                Get comprehensive answers with source citations and references
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get instant responses powered by cutting-edge technology
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Designed by <span className="font-medium">Frank Bazuaye</span> • 
              Powered by <span className="font-medium">LiveGig Ltd</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;