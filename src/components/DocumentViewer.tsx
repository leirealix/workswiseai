
import { useState } from 'react';
import { AnalysisResult, DocumentClause } from '@/types';
import { cn } from '@/lib/utils';
import { File, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentViewerProps {
  fileName: string;
  result: AnalysisResult;
}

export default function DocumentViewer({ fileName, result }: DocumentViewerProps) {
  const [selectedClause, setSelectedClause] = useState<DocumentClause | null>(null);

  // Mock document pages
  const pages = Array.from({ length: 5 }, (_, i) => i + 1);

  const handleClauseClick = (clause: DocumentClause) => {
    setSelectedClause(clause === selectedClause ? null : clause);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <FileText size={20} className="mr-2 text-primary" />
          <h3 className="font-medium">{fileName}</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {pages.map((pageNum) => {
            const pageClauses = result.clauses.filter(clause => clause.page === pageNum);
            
            return (
              <div key={pageNum} className="bg-white dark:bg-black/20 border rounded-lg overflow-hidden shadow-sm">
                <div className="border-b px-3 py-2 bg-muted/30 text-xs text-muted-foreground">
                  Page {pageNum}
                </div>
                <div className="p-4 relative" style={{ height: '300px' }}>
                  {/* Mock document content */}
                  <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded">
                    <div className="text-muted-foreground">
                      <File size={24} className="mx-auto mb-2" />
                      <span className="text-xs">Document Preview</span>
                    </div>
                  </div>
                  
                  {/* Highlight areas for clauses */}
                  {pageClauses.map((clause) => (
                    <div
                      key={clause.id}
                      className={cn(
                        "absolute border-2 rounded cursor-pointer transition-all",
                        selectedClause?.id === clause.id
                          ? "border-primary bg-primary/10"
                          : "border-primary/40 bg-primary/5 hover:bg-primary/10"
                      )}
                      style={{
                        left: `${clause.position.x}px`,
                        top: `${clause.position.y}px`,
                        width: `${clause.position.width}px`,
                        height: `${clause.position.height}px`,
                      }}
                      onClick={() => handleClauseClick(clause)}
                    />
                  ))}
                </div>
                
                {/* Signature section on the last page */}
                {pageNum === pages.length && result.signatures.length > 0 && (
                  <div className="border-t p-4">
                    <div className="text-sm font-medium mb-2">Signatures</div>
                    <div className="grid grid-cols-2 gap-4">
                      {result.signatures.map((sig, i) => (
                        <div key={i} className="border rounded p-3 bg-muted/10">
                          <div className="font-medium text-sm">{sig.name}</div>
                          <div className="text-xs text-muted-foreground">{sig.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      {selectedClause && (
        <div className="border-t p-4 bg-secondary/50 animate-slide-in-up">
          <h4 className="font-medium text-sm">{selectedClause.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{selectedClause.content}</p>
        </div>
      )}
    </div>
  );
}
