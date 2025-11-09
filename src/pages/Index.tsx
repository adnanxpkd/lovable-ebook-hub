import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { BookCard } from "@/components/BookCard";
import { BookDetailModal } from "@/components/BookDetailModal";
import { Pagination } from "@/components/Pagination";
import { SortControls, SortOption } from "@/components/SortControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { Book, BookOpen, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ITEMS_PER_PAGE = 12;

interface BookType {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  format: string;
  file_size: number;
  download_url: string;
  cover_image_url: string | null;
  published_date: string | null;
  isbn: string | null;
  language: string | null;
}

const Index = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch books from database
  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchQuery, sortBy]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('books')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      // Apply sorting
      const [field, direction] = sortBy.split('-') as [string, 'asc' | 'desc'];
      if (field === 'title') {
        query = query.order('title', { ascending: direction === 'asc' });
      } else if (field === 'size') {
        query = query.order('file_size', { ascending: direction === 'asc' });
      } else if (field === 'date') {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setBooks(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to load books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">eBooks Hub</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Offline Alert */}
      {!isOnline && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You are currently offline. Some features may not be available.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <Book className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Discover Your Next Great Read
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of free eBooks. Search, explore, and download your favorites instantly.
          </p>
          <SearchBar onSearch={handleSearch} className="mt-8" />
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {totalCount > 0 ? (
              <span>
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} books
              </span>
            ) : (
              <span>No books found</span>
            )}
          </div>
          <SortControls value={sortBy} onChange={setSortBy} />
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading books...</p>
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author || undefined}
                  format={book.format}
                  fileSize={book.file_size}
                  coverImage={book.cover_image_url || undefined}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-12"
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">
              {searchQuery ? `No books found for "${searchQuery}"` : "No books available"}
            </p>
          </div>
        )}
      </section>

      {/* Book Detail Modal */}
      <BookDetailModal
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 eBooks Hub. Discover knowledge, one book at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
