CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_api_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  service_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraint
  CONSTRAINT fk_user_api_credentials_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Ensure one credential per service per user
  CONSTRAINT uk_user_service 
    UNIQUE (user_id, service_name)
);

-- Indexes for performance
CREATE INDEX idx_user_api_credentials_user_id ON user_api_credentials(user_id);
CREATE INDEX idx_user_api_credentials_service ON user_api_credentials(service_name);
CREATE INDEX idx_user_api_credentials_expires_at ON user_api_credentials(expires_at);
CREATE INDEX idx_user_api_credentials_user_service ON user_api_credentials(user_id, service_name);
