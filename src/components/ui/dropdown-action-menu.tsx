
import * as React from "react";
import { MoreHorizontalIcon, FileIcon, SaveIcon, MailIcon, ArrowRightIcon, FileTextIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface DropdownActionMenuProps {
  entityName: string;
}

export function DropdownActionMenu({ entityName }: DropdownActionMenuProps) {
  const handleExportWord = () => {
    toast({
      title: `Exporting ${entityName} as Word`,
      description: `${entityName} is being exported as a Word document.`,
      variant: "default",
    });
    
    // In a real app, this would trigger an actual download
    // Simulate download with a timeout
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${entityName} has been exported as a Word document.`,
        variant: "success",
      });
    }, 1500);
  };

  const handleExportPDF = () => {
    toast({
      title: `Exporting ${entityName} as PDF`,
      description: `${entityName} is being exported as a PDF document.`,
      variant: "default",
    });
    
    // Simulate download with a timeout
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${entityName} has been exported as a PDF document.`,
        variant: "success",
      });
    }, 1500);
  };

  const handleSaveToIManage = () => {
    toast({
      title: `Saving ${entityName} to iManage`,
      description: `${entityName} is being saved to iManage.`,
      variant: "default",
    });
    
    // Simulate saving with a timeout
    setTimeout(() => {
      toast({
        title: "Save Complete",
        description: `${entityName} has been saved to iManage successfully.`,
        variant: "success",
      });
    }, 2000);
  };

  const handleSendEmail = () => {
    toast({
      title: "Preparing Email",
      description: `${entityName} is being prepared for email.`,
      variant: "default",
    });
    
    // Simulate email preparation with a timeout
    setTimeout(() => {
      toast({
        title: "Email Ready",
        description: `${entityName} is ready to send via email. Opening your email client...`,
        variant: "success",
      });
    }, 1500);
  };

  const handlePrintDocument = () => {
    toast({
      title: "Preparing to Print",
      description: `${entityName} is being prepared for printing.`,
      variant: "default",
    });
    
    // Simulate print dialog
    setTimeout(() => {
      toast({
        title: "Print Dialog Opened",
        description: "The print dialog has been opened.",
        variant: "success",
      });
      
      // In a real app, this would trigger window.print()
      // For this demo, we'll just show a toast
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <ArrowRightIcon size={14} />
          <span>Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md">
        <DropdownMenuItem onClick={handleExportWord} className="flex items-center gap-2 cursor-pointer">
          <FileTextIcon size={14} />
          <span>Export as Word</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="flex items-center gap-2 cursor-pointer">
          <FileIcon size={14} />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSaveToIManage} className="flex items-center gap-2 cursor-pointer">
          <SaveIcon size={14} />
          <span>Save to iManage</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrintDocument} className="flex items-center gap-2 cursor-pointer">
          <Download size={14} />
          <span>Print Document</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSendEmail} className="flex items-center gap-2 cursor-pointer">
          <MailIcon size={14} />
          <span>Send via Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
