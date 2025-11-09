-- Create books table for storing ebook metadata
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  format TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- size in bytes
  download_url TEXT NOT NULL,
  cover_image_url TEXT,
  published_date DATE,
  isbn TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (no authentication required)
CREATE POLICY "Books are viewable by everyone" 
ON public.books 
FOR SELECT 
USING (true);

-- Create index for faster text search on title and author
CREATE INDEX idx_books_title_search ON public.books USING gin(to_tsvector('english', title));
CREATE INDEX idx_books_author_search ON public.books USING gin(to_tsvector('english', author));

-- Insert sample data for testing
INSERT INTO public.books (title, author, description, format, file_size, download_url, cover_image_url, language) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic American novel set in the Jazz Age', 'PDF', 1048576, 'https://example.com/gatsby.pdf', NULL, 'English'),
('To Kill a Mockingbird', 'Harper Lee', 'A gripping tale of racial injustice and childhood innocence', 'EPUB', 2097152, 'https://example.com/mockingbird.epub', NULL, 'English'),
('1984', 'George Orwell', 'A dystopian social science fiction novel', 'PDF', 1572864, 'https://example.com/1984.pdf', NULL, 'English'),
('Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners', 'EPUB', 1310720, 'https://example.com/pride.epub', NULL, 'English'),
('The Catcher in the Rye', 'J.D. Salinger', 'A story about teenage rebellion and angst', 'PDF', 921600, 'https://example.com/catcher.pdf', NULL, 'English'),
('Moby-Dick', 'Herman Melville', 'The narrative of Captain Ahab''s obsession', 'EPUB', 2621440, 'https://example.com/moby.epub', NULL, 'English'),
('War and Peace', 'Leo Tolstoy', 'An epic historical novel', 'PDF', 5242880, 'https://example.com/war.pdf', NULL, 'English'),
('The Odyssey', 'Homer', 'An ancient Greek epic poem', 'EPUB', 1835008, 'https://example.com/odyssey.epub', NULL, 'English')