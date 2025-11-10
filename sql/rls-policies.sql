-- Row Level Security policies for chat functionality
-- Run these commands in your Supabase SQL editor

-- Enable RLS on threads table
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- Enable RLS on messages table  
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy for threads: Users can only see their own threads
CREATE POLICY "Users can view own threads" ON threads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own threads" ON threads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads" ON threads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own threads" ON threads
    FOR DELETE USING (auth.uid() = user_id);

-- Policy for messages: Users can only see messages from their own threads
CREATE POLICY "Users can view messages from own threads" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM threads 
            WHERE threads.id = messages.thread_id 
            AND threads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to own threads" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM threads 
            WHERE threads.id = messages.thread_id 
            AND threads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages from own threads" ON messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM threads 
            WHERE threads.id = messages.thread_id 
            AND threads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages from own threads" ON messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM threads 
            WHERE threads.id = messages.thread_id 
            AND threads.user_id = auth.uid()
        )
    );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threads_user_id ON threads(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_updated_at ON threads(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Add function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update updated_at on threads
CREATE TRIGGER update_threads_updated_at 
    BEFORE UPDATE ON threads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to automatically update updated_at on messages
CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
