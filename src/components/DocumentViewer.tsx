
import { useState } from 'react';
import { AnalysisResult, DocumentClause } from '@/types';
import { cn } from '@/lib/utils';
import { File, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface DocumentViewerProps {
  fileName: string;
  result: AnalysisResult;
  comparison?: boolean;
}

export default function DocumentViewer({ fileName, result, comparison = false }: DocumentViewerProps) {
  const [selectedClause, setSelectedClause] = useState<DocumentClause | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Mock document pages
  const pages = Array.from({ length: 5 }, (_, i) => i + 1);

  const handleClauseClick = (clause: DocumentClause) => {
    setSelectedClause(clause === selectedClause ? null : clause);
  };

  const nextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter clauses for current page only when in comparison mode
  const displayClauses = comparison 
    ? result.clauses.filter(clause => clause.page === currentPage)
    : result.clauses;

  // Only show signatures on the last page
  const displaySignatures = comparison && currentPage === pages.length
    ? result.signatures
    : comparison ? [] : result.signatures;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background/90 to-background">
      <div className="px-3 py-2 border-b bg-background/30 backdrop-blur-sm">
        <div className="flex items-center">
          <FileText size={16} className="mr-1.5 text-primary" />
          <h3 className="font-medium text-xs">{fileName}</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {comparison ? (
            // Show only current page in comparison mode
            <div className="bg-white dark:bg-black/20 border rounded-lg overflow-hidden shadow-md">
              <div className="border-b px-2.5 py-1.5 bg-muted/20 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Page {currentPage}</span>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className="h-5 w-5"
                  >
                    <ChevronLeft size={12} />
                  </Button>
                  <span className="text-xs">{currentPage} / {pages.length}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={nextPage} 
                    disabled={currentPage === pages.length}
                    className="h-5 w-5"
                  >
                    <ChevronRight size={12} />
                  </Button>
                </div>
              </div>
              <div className="p-3 relative min-h-[280px] bg-gradient-to-r from-white/5 to-transparent dark:from-white/2" style={{ minHeight: '280px' }}>
                {/* Mock document content */}
                <div className="h-full w-full flex items-center justify-center bg-muted/5 rounded border border-border/50">
                  <div className="text-muted-foreground">
                    <File size={20} className="mx-auto mb-1.5 opacity-40" />
                    <span className="text-xs">Document Preview - Page {currentPage}</span>
                  </div>
                </div>
                
                {/* Highlight areas for clauses */}
                {displayClauses.map((clause) => (
                  <div
                    key={clause.id}
                    className={cn(
                      "absolute border-2 rounded cursor-pointer transition-all shadow-sm",
                      selectedClause?.id === clause.id
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20 ring-offset-1"
                        : "border-primary/40 bg-primary/5 hover:bg-primary/10"
                    )}
                    style={{
                      left: `${clause.position.x}%`,
                      top: `${clause.position.y}%`,
                      width: `${clause.position.width}%`,
                      height: `${clause.position.height}%`,
                    }}
                    onClick={() => handleClauseClick(clause)}
                  />
                ))}
              </div>
              
              {/* Signature section on the last page */}
              {displaySignatures.length > 0 && (
                <div className="border-t p-3 bg-background/20">
                  <div className="text-xs font-medium mb-1.5">Signatures</div>
                  <div className="grid grid-cols-2 gap-2">
                    {displaySignatures.map((sig, i) => (
                      <div key={i} className="border rounded p-2 bg-card shadow-sm hover:shadow transition-all">
                        <div className="font-medium text-xs">{sig.name}</div>
                        <div className="text-[10px] text-muted-foreground">{sig.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show all pages in normal mode
            pages.map((pageNum) => {
              const pageClauses = result.clauses.filter(clause => clause.page === pageNum);
              
              return (
                <div key={pageNum} className="bg-white dark:bg-black/20 border rounded-lg overflow-hidden shadow-md">
                  <div className="border-b px-2.5 py-1.5 bg-muted/20 text-xs text-muted-foreground">
                    Page {pageNum}
                  </div>
                  <div className="p-3 relative min-h-[280px] bg-gradient-to-r from-white/5 to-transparent dark:from-white/2" style={{ minHeight: '280px' }}>
                    {/* Mock document content */}
                    <div className="h-full w-full flex items-center justify-center bg-muted/5 rounded border border-border/50">
                      <div className="text-muted-foreground">
                        <File size={20} className="mx-auto mb-1.5 opacity-40" />
                        <span className="text-xs">Document Preview - Page {pageNum}</span>
                      </div>
                    </div>
                    
                    {/* Highlight areas for clauses */}
                    {pageClauses.map((clause) => (
                      <div
                        key={clause.id}
                        className={cn(
                          "absolute border-2 rounded cursor-pointer transition-all shadow-sm",
                          selectedClause?.id === clause.id
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20 ring-offset-1"
                            : "border-primary/40 bg-primary/5 hover:bg-primary/10"
                        )}
                        style={{
                          left: `${clause.position.x}%`,
                          top: `${clause.position.y}%`,
                          width: `${clause.position.width}%`,
                          height: `${clause.position.height}%`,
                        }}
                        onClick={() => handleClauseClick(clause)}
                      />
                    ))}
                  </div>
                  
                  {/* Signature section on the last page */}
                  {pageNum === pages.length && result.signatures.length > 0 && (
                    <div className="border-t p-3 bg-background/20">
                      <div className="text-xs font-medium mb-1.5">Signatures</div>
                      <div className="grid grid-cols-2 gap-2">
                        {result.signatures.map((sig, i) => (
                          <div key={i} className="border rounded p-2 bg-card shadow-sm hover:shadow transition-all">
                            <div className="font-medium text-xs">{sig.name}</div>
                            <div className="text-[10px] text-muted-foreground">{sig.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
      
      {selectedClause && (
        <div className="border-t p-3 bg-card/50 backdrop-blur-sm animate-slide-in-up">
          <h4 className="font-medium text-xs">{selectedClause.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{selectedClause.content}</p>
        </div>
      )}
    </div>
  );
}
