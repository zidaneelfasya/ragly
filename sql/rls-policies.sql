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

-- RLS policies for chatbots functionality

-- Enable Row Level Security for chatbot tables
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_rag_files ENABLE ROW LEVEL SECURITY;  
ALTER TABLE chatbot_commands ENABLE ROW LEVEL SECURITY;

-- Policies for chatbots table
CREATE POLICY "Users can view their own chatbots" ON chatbots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chatbots" ON chatbots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbots" ON chatbots
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbots" ON chatbots
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public chatbots are viewable by all" ON chatbots
    FOR SELECT USING (is_public = true);

-- Policies for chatbot_rag_files table
CREATE POLICY "Users can manage files for their chatbots" ON chatbot_rag_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_rag_files.chatbot_id 
            AND chatbots.user_id = auth.uid()
        )
    );

-- Policies for chatbot_commands table
CREATE POLICY "Users can manage commands for their chatbots" ON chatbot_commands
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chatbots 
            WHERE chatbots.id = chatbot_commands.chatbot_id 
            AND chatbots.user_id = auth.uid()
        )
    );

-- Indexes for chatbot performance
CREATE INDEX IF NOT EXISTS idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbots_status ON chatbots(status);
CREATE INDEX IF NOT EXISTS idx_chatbots_is_public ON chatbots(is_public);
CREATE INDEX IF NOT EXISTS idx_chatbot_rag_files_chatbot_id ON chatbot_rag_files(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_commands_chatbot_id ON chatbot_commands(chatbot_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at on chatbots
DROP TRIGGER IF EXISTS update_chatbots_updated_at ON chatbots;
CREATE TRIGGER update_chatbots_updated_at 
    BEFORE UPDATE ON chatbots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
