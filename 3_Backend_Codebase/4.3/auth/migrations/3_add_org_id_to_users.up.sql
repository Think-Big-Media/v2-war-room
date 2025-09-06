-- Add org_id column to users table
ALTER TABLE users ADD COLUMN org_id UUID;

-- Create the foreign key constraint
ALTER TABLE users ADD CONSTRAINT fk_users_organization 
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX idx_users_org_id ON users(org_id);

-- For existing users, create a default organization and assign them to it
-- This ensures data integrity for any existing test data
DO $$
DECLARE
  default_org_id UUID;
BEGIN
  -- Check if there are any existing users without an organization
  IF EXISTS (SELECT 1 FROM users WHERE org_id IS NULL) THEN
    -- Create a default organization
    INSERT INTO organizations (name) 
    VALUES ('Default Organization') 
    RETURNING id INTO default_org_id;
    
    -- Assign all existing users to this organization
    UPDATE users SET org_id = default_org_id WHERE org_id IS NULL;
  END IF;
END $$;

-- Make org_id NOT NULL after setting default values
ALTER TABLE users ALTER COLUMN org_id SET NOT NULL;
