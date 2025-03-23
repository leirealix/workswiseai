
import * as React from "react";
import { MoreHorizontalIcon, FileIcon, SaveIcon, MailIcon, ArrowRightIcon } from "lucide-react";
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
      title: "Exporting as Word",
      description: `${entityName} is being exported as a Word document.`,
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting as PDF",
      description: `${entityName} is being exported as a PDF document.`,
    });
  };

  const handleSaveToIManage = () => {
    toast({
      title: "Saving to iManage",
      description: `${entityName} is being saved to iManage.`,
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Sending via Email",
      description: `${entityName} is being prepared for email.`,
    });
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
          <FileIcon size={14} />
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSendEmail} className="flex items-center gap-2 cursor-pointer">
          <MailIcon size={14} />
          <span>Send via Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
