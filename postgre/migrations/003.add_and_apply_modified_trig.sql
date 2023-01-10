-- Create a trigger that automatically updates the modified_at column with current timestamp
CREATE OR REPLACE FUNCTION update_modified_at()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

-- Apply the aforementioned trigger to stations table
CREATE TRIGGER update_stations_modified_at BEFORE UPDATE ON stations FOR EACH ROW EXECUTE PROCEDURE  update_modified_at();
