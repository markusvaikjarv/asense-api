-- Create gas stations table
-- In a real application, there would probably also have to be a reference to the company/franchise for pricing,
-- pricing would probably have to be in a different table, as multiple gas station (in same franchise) could use the same synced pricing model

CREATE TABLE stations (
    id uuid DEFAULT uuid_generate_v4 (),
    name TEXT NOT NULL,
    city TEXT DEFAULT NULL,
    street TEXT DEFAULT NULL,
    location GEOGRAPHY(Point) NOT NULL, -- Geography type to allow for geospatial queries and indices
    gas_95_price FLOAT DEFAULT NULL,
    gas_95_active BOOLEAN DEFAULT FALSE,
    gas_98_price FLOAT DEFAULT NULL,
    gas_98_active BOOLEAN DEFAULT FALSE,
    diesel_price FLOAT DEFAULT NULL,
    diesel_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- B-Tree index on created_at columns, since it's used for ordering results in API requests
CREATE INDEX idx_stations_created_at ON stations(created_at);