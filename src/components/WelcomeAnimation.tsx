
import { FileIcon, FileTextIcon, SearchIcon, BrainCogIcon } from 'lucide-react';
import LawyerIcon from './LawyerIcon';

export default function WelcomeAnimation() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="relative w-36 h-36 mb-8">
        {/* Center icon with pulse effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <LawyerIcon size={32} className="text-primary animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        
        {/* Orbiting document icons with staggered timing */}
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg animate-pulse-subtle">
              <FileTextIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '12s', animationDelay: '0.5s' }}>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg animate-pulse-subtle">
              <FileIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '10s', animationDelay: '0.3s' }}>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg animate-pulse-subtle">
              <SearchIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        {/* New orbiting elements for more animation */}
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '9s', animationDelay: '0.7s' }}>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
            <div className="bg-primary/30 p-2 rounded-lg animate-pulse-subtle">
              <BrainCogIcon size={24} className="text-primary-foreground" />
            </div>
          </div>
        </div>
        
        {/* Decorative rings around the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }}></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-3 animate-fade-in">AI Lawyer</h3>
      <p className="text-center text-muted-foreground max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Ask me to complete any work you request. I can help do due diligence, legal research, extract key information, generate summaries, and provide legal insights.
      </p>
    </div>
  );
}
