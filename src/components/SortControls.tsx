import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type SortOption = "title-asc" | "title-desc" | "size-asc" | "size-desc" | "date-desc";

interface SortControlsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export const SortControls = ({ value, onChange, className = "" }: SortControlsProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={(val) => onChange(val as SortOption)}>
        <SelectTrigger className="w-[180px] border-2 focus:ring-primary">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title-asc">Title (A-Z)</SelectItem>
          <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          <SelectItem value="size-asc">Size (Low to High)</SelectItem>
          <SelectItem value="size-desc">Size (High to Low)</SelectItem>
          <SelectItem value="date-desc">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
