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