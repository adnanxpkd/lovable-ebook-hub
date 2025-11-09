import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  id: string;
  title: string;
  author?: string;
  format: string;
  fileSize: number;
  coverImage?: string;
  onClick: () => void;
}

// Format bytes to human readable size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const BookCard = ({ title, author, format, fileSize, coverImage, onClick }: BookCardProps) => {
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-primary hover:-translate-y-1 border-border overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary-glow to-secondary relative overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-20 h-20 text-primary opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <h3 className="font-semibold text-base line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {author && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {author}
          </p>
        )}
        <div className="flex items-center gap-2 w-full mt-1">
          <Badge variant="secondary" className="text-xs">
            {format}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <HardDrive className="w-3 h-3" />
            <span>{formatFileSize(fileSize)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
