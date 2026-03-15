-- Add user_note column to items table
ALTER TABLE items ADD COLUMN user_note TEXT;

-- Update RLS if necessary (it should be covered by the existing "user owns items" policy)
