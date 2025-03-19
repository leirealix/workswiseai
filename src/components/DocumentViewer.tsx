
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <FileText size={20} className="mr-2 text-primary" />
          <h3 className="font-medium">{fileName}</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {comparison ? (
            // Show only current page in comparison mode
            <div className="bg-white dark:bg-black/20 border rounded-lg overflow-hidden shadow-sm">
              <div className="border-b px-3 py-2 bg-muted/30 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Page {currentPage}</span>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className="h-6 w-6"
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <span className="text-xs">{currentPage} / {pages.length}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={nextPage} 
                    disabled={currentPage === pages.length}
                    className="h-6 w-6"
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
              <div className="p-4 relative min-h-[300px]" style={{ minHeight: '300px' }}>
                {/* Mock document content */}
                <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded">
                  <div className="text-muted-foreground">
                    <File size={24} className="mx-auto mb-2" />
                    <span className="text-xs">Document Preview - Page {currentPage}</span>
                  </div>
                </div>
                
                {/* Highlight areas for clauses */}
                {displayClauses.map((clause) => (
                  <div
                    key={clause.id}
                    className={cn(
                      "absolute border-2 rounded cursor-pointer transition-all",
                      selectedClause?.id === clause.id
                        ? "border-primary bg-primary/10"
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
                <div className="border-t p-4">
                  <div className="text-sm font-medium mb-2">Signatures</div>
                  <div className="grid grid-cols-2 gap-4">
                    {displaySignatures.map((sig, i) => (
                      <div key={i} className="border rounded p-3 bg-muted/10">
                        <div className="font-medium text-sm">{sig.name}</div>
                        <div className="text-xs text-muted-foreground">{sig.role}</div>
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
                <div key={pageNum} className="bg-white dark:bg-black/20 border rounded-lg overflow-hidden shadow-sm">
                  <div className="border-b px-3 py-2 bg-muted/30 text-xs text-muted-foreground">
                    Page {pageNum}
                  </div>
                  <div className="p-4 relative min-h-[300px]" style={{ minHeight: '300px' }}>
                    {/* Mock document content */}
                    <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded">
                      <div className="text-muted-foreground">
                        <File size={24} className="mx-auto mb-2" />
                        <span className="text-xs">Document Preview - Page {pageNum}</span>
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
            })
          )}
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
