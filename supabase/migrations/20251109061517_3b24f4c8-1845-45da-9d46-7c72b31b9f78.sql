CREATE TABLE public.books_telegram (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  _id TEXT,               -- Telegram unique file id (for start param)
  file_ref TEXT,          -- Telegram file reference string
  file_name TEXT NOT NULL,-- Actual file name
  file_size BIGINT,       -- in bytes
  file_type TEXT,         -- "document", "video", "audio" etc.
  mime_type TEXT,         -- e.g. "application/pdf"
  caption TEXT,           -- Description / book title / info text
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for security
ALTER TABLE public.books_telegram ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT (read) access
CREATE POLICY "Public read access to books_telegram"
ON public.books_telegram
FOR SELECT
USING (true);

-- Indexes for faster searching
CREATE INDEX idx_books_telegram_name ON public.books_telegram USING gin(to_tsvector('english', file_name));
CREATE INDEX idx_books_telegram_caption ON public.books_telegram USING gin(to_tsvector('english', caption));
