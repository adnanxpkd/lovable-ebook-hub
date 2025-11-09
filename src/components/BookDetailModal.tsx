import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, HardDrive, Calendar, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BookDetailModalProps {
  open: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    author?: string;
    description?: string;
    format: string;
    file_size: number;
    download_url: string;
    cover_image_url?: string;
    published_date?: string;
    isbn?: string;
    language?: string;
  } | null;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const BookDetailModal = ({ open, onClose, book }: BookDetailModalProps) => {
  if (!book) return null;

  const handleDownload = () => {
    window.open(book.download_url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {book.title}
          </DialogTitle>
          {book.author && (
            <DialogDescription className="text-base text-muted-foreground">
              by {book.author}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Cover Image */}
          <div className="aspect-[3/4] max-w-xs mx-auto bg-gradient-to-br from-primary-glow to-secondary rounded-lg overflow-hidden">
            {book.cover_image_url ? (
              <img 
                src={book.cover_image_url} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-24 h-24 text-primary opacity-30" />
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          {book.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-foreground">Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Format:</span>
                <Badge variant="secondary">{book.format}</Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium text-foreground">{formatFileSize(book.file_size)}</span>
              </div>

              {book.language && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-medium text-foreground">{book.language}</span>
                </div>
              )}

              {book.published_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Published:</span>
                  <span className="font-medium text-foreground">
                    {new Date(book.published_date).getFullYear()}
                  </span>
                </div>
              )}

              {book.isbn && (
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <span className="text-muted-foreground">ISBN:</span>
                  <span className="font-medium text-foreground">{book.isbn}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Download Button */}
          <Button 
            onClick={handleDownload}
            className="w-full h-12 text-base bg-primary hover:bg-primary-light shadow-primary transition-all"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download {book.format}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
