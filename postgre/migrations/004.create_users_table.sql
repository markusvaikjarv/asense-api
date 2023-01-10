-- Create users table
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 (),
    api_key_sha256 VARCHAR(64) NOT NULL, -- Api keys are stored as 256-bit hashes (using SHA-256)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create index on hashed api key column.
-- Using the HASH index instead of the normal B-TREE, since the column will only be used in single-record, full equality queries
CREATE INDEX idx_users_api_key_sha256 ON users USING HASH (api_key_sha256);

-- Apply the the modified_at column update trigger to the table
CREATE TRIGGER update_users_modified_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE  update_modified_at();