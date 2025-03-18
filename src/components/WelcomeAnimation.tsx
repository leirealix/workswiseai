
import { FileIcon, FileTextIcon, SearchIcon, BrainCogIcon } from 'lucide-react';

export default function WelcomeAnimation() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="relative w-36 h-36 mb-8">
        {/* Orbit animation with document icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <BrainCogIcon size={32} className="text-primary" />
          </div>
        </div>
        
        {/* Orbiting document icons */}
        <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg">
              <FileTextIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '12s', animationDelay: '0.5s' }}>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg">
              <FileIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '10s', animationDelay: '0.3s' }}>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg">
              <SearchIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-3 animate-fade-in">AI Lawyer</h3>
      <p className="text-center text-muted-foreground max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Upload a document or ask me to complete any work you request. I can help extract key information, generate summaries, and provide legal insights.
      </p>
    </div>
  );
}
