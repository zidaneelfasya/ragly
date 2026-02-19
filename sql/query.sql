-- User profiles with roles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email VARCHAR(255),
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- Function to automatically create profile when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE chatbots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(100) NOT NULL DEFAULT 'gpt-4-turbo',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    is_public BOOLEAN DEFAULT FALSE,
    personality TEXT,
    manual_knowledge TEXT,
    knowledge_url TEXT,
    welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
    fallback_message TEXT DEFAULT 'I apologize, but I could not find an answer to your question.',
    tone VARCHAR(50) DEFAULT 'Friendly',
    temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base files
CREATE TABLE chatbot_rag_files (
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    original_name VARCHAR,
    unique_name VARCHAR,
    path_url TEXT,
    upload_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
);

-- Custom commands for chatbot
CREATE TABLE chatbot_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    command_name VARCHAR(100) NOT NULL,
    command_description TEXT,
    command_action TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_telegram_bots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bot_token TEXT NOT NULL,
    bot_username TEXT NOT NULL,
    webhook_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    session BOOLEAN DEFAULT false,
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
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX(chatbot_id, timestamp),
    INDEX(telegram_chat_id, timestamp)
);
