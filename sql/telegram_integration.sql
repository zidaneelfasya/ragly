-- Create table for storing Telegram bot configurations
CREATE TABLE IF NOT EXISTS chatbot_telegram_bots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bot_token TEXT NOT NULL,
    bot_username TEXT NOT NULL,
    webhook_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chatbot_id, user_id)
);

-- Create table for storing Telegram conversations (optional, for analytics)
CREATE TABLE IF NOT EXISTS telegram_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    telegram_user_id TEXT NOT NULL,
    telegram_chat_id TEXT NOT NULL,
    user_message TEXT,
    ai_response TEXT,
    session BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX(chatbot_id, timestamp),
    INDEX(telegram_chat_id, timestamp)
);

-- Add RLS policies for Telegram bot configurations
ALTER TABLE chatbot_telegram_bots ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own Telegram bots
CREATE POLICY "Users can manage their own telegram bots" ON chatbot_telegram_bots
    FOR ALL USING (user_id = auth.uid());

-- Add RLS policies for Telegram conversations
ALTER TABLE telegram_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access conversations from their own chatbots
CREATE POLICY "Users can view their chatbot conversations" ON telegram_conversations
    FOR SELECT USING (
        chatbot_id IN (
            SELECT id FROM chatbots WHERE user_id = auth.uid()
        )
    );

-- Policy: Allow inserts for conversations (webhooks need this)
CREATE POLICY "Allow conversation inserts" ON telegram_conversations
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_telegram_bots_chatbot_id ON chatbot_telegram_bots(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_telegram_bots_user_id ON chatbot_telegram_bots(user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_conversations_chatbot_id ON telegram_conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_telegram_conversations_telegram_chat_id ON telegram_conversations(telegram_chat_id);

-- Add updated_at trigger for chatbot_telegram_bots
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_telegram_bots_updated_at 
    BEFORE UPDATE ON chatbot_telegram_bots 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
