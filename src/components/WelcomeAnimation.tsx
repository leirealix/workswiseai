
import { FileIcon, FileTextIcon, SearchIcon, BrainCogIcon, SparklesIcon, GavelIcon, ScaleIcon, BarChartIcon } from 'lucide-react';
import LawyerIcon from './LawyerIcon';

export default function WelcomeAnimation() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="relative w-48 h-48 mb-8">
        {/* Center icon with enhanced pulse effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <div className="absolute inset-0 w-full h-full rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-0 w-full h-full rounded-full border border-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
            <BarChartIcon size={36} className="text-primary animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        
        {/* Sparkles around the center icon */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 animate-pulse" style={{ animationDuration: '1.5s' }}>
            <SparklesIcon size={16} className="text-primary/60" />
          </div>
          <div className="absolute bottom-1/3 left-1/4 animate-pulse" style={{ animationDuration: '2s' }}>
            <SparklesIcon size={12} className="text-primary/60" />
          </div>
        </div>
        
        {/* Legal themed icons orbiting */}
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '12s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg animate-pulse-subtle shadow-md">
              <GavelIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '15s', animationDelay: '0.5s' }}>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg animate-pulse-subtle shadow-md">
              <ScaleIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        {/* Original orbiting document icons */}
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '10s', animationDelay: '0.3s' }}>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-secondary/50 p-2 rounded-lg animate-pulse-subtle shadow-md">
              <FileTextIcon size={24} className="text-secondary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '9s', animationDelay: '0.7s' }}>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
            <div className="bg-primary/30 p-2 rounded-lg animate-pulse-subtle shadow-md">
              <BrainCogIcon size={24} className="text-primary-foreground" />
            </div>
          </div>
        </div>
        
        {/* Additional smaller orbiting elements */}
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '7s', animationDelay: '1s', transform: 'rotate(45deg)' }}>
          <div className="absolute top-1/4 right-0 transform translate-x-1/2">
            <div className="bg-primary/20 p-1.5 rounded-full animate-pulse-subtle shadow-sm">
              <SearchIcon size={16} className="text-primary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '8s', animationDelay: '0.5s', transform: 'rotate(-45deg)' }}>
          <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2">
            <div className="bg-primary/20 p-1.5 rounded-full animate-pulse-subtle shadow-sm">
              <FileIcon size={16} className="text-primary-foreground" />
            </div>
          </div>
        </div>
        
        {/* Decorative rings around the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }}></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Light rays/beams emanating from center */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-full w-1 bg-gradient-to-t from-transparent via-primary/10 to-transparent"
              style={{ 
                transform: `rotate(${i * 45}deg)`, 
                animation: 'pulse 2.5s infinite', 
                animationDelay: `${i * 0.1}s` 
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-3 animate-fade-in">Works Wise</h3>
      <p className="text-center text-muted-foreground max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Ask me to complete any work you request. I can help do due diligence, legal research, extract key information, generate summaries, and provide legal insights.
      </p>
    </div>
  );
}
