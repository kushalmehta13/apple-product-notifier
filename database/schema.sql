-- Apple Product Notifier Database Schema
-- This file contains the SQL schema for setting up the Supabase database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Apple Stores table
CREATE TABLE IF NOT EXISTS apple_stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for geographic queries
CREATE INDEX IF NOT EXISTS idx_apple_stores_location ON apple_stores USING GIST (
    ST_Point(longitude, latitude)
);

-- Create index for zip code queries
CREATE INDEX IF NOT EXISTS idx_apple_stores_zip ON apple_stores(zip_code);

-- Product availability table
CREATE TABLE IF NOT EXISTS product_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES apple_stores(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL, -- e.g., 'iphone-17-pro-max-256gb'
    color TEXT NOT NULL, -- e.g., 'cosmic-orange', 'deep-blue', 'silver'
    storage TEXT NOT NULL, -- e.g., '256GB', '512GB', '1TB'
    available BOOLEAN NOT NULL DEFAULT FALSE,
    pickup_available_at TIMESTAMP WITH TIME ZONE,
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique combination of store, product, color
    UNIQUE(store_id, product_id, color)
);

-- Create indexes for availability queries
CREATE INDEX IF NOT EXISTS idx_product_availability_store ON product_availability(store_id);
CREATE INDEX IF NOT EXISTS idx_product_availability_product ON product_availability(product_id);
CREATE INDEX IF NOT EXISTS idx_product_availability_available ON product_availability(available);
CREATE INDEX IF NOT EXISTS idx_product_availability_checked ON product_availability(last_checked);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT,
    phone TEXT,
    zip_code TEXT NOT NULL,
    product_id TEXT NOT NULL,
    color TEXT,
    storage TEXT,
    notification_types TEXT[] NOT NULL DEFAULT '{}', -- ['email', 'sms']
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure at least one contact method
    CONSTRAINT check_contact_method CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Create indexes for notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_zip ON notifications(zip_code);
CREATE INDEX IF NOT EXISTS idx_notifications_product ON notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_active ON notifications(active);
CREATE INDEX IF NOT EXISTS idx_notifications_email ON notifications(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_phone ON notifications(phone) WHERE phone IS NOT NULL;

-- Function to calculate distance between two points (in miles)
CREATE OR REPLACE FUNCTION calculate_distance_miles(
    lat1 DECIMAL, lon1 DECIMAL, 
    lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    RETURN ST_Distance(
        ST_Point(lon1, lat1)::geography,
        ST_Point(lon2, lat2)::geography
    ) * 0.000621371; -- Convert meters to miles
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find stores within radius
CREATE OR REPLACE FUNCTION find_stores_within_radius(
    search_lat DECIMAL,
    search_lon DECIMAL,
    radius_miles DECIMAL DEFAULT 25
) RETURNS TABLE (
    store_id UUID,
    distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        calculate_distance_miles(search_lat, search_lon, s.latitude, s.longitude) as distance
    FROM apple_stores s
    WHERE calculate_distance_miles(search_lat, search_lon, s.latitude, s.longitude) <= radius_miles
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_apple_stores_updated_at 
    BEFORE UPDATE ON apple_stores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample Apple stores (you'll need to populate with real data)
INSERT INTO apple_stores (name, address, city, state, zip_code, latitude, longitude, phone) VALUES
('Apple Store - Union Square', '300 Post St', 'San Francisco', 'CA', '94108', 37.7880, -122.4074, '(415) 392-0202'),
('Apple Store - Stonestown Galleria', '3251 20th Ave', 'San Francisco', 'CA', '94132', 37.7318, -122.4667, '(415) 759-2220'),
('Apple Store - Palo Alto', '340 University Ave', 'Palo Alto', 'CA', '94301', 37.4419, -122.1430, '(650) 330-0100'),
('Apple Store - Valley Fair', '2855 Stevens Creek Blvd', 'San Jose', 'CA', '95128', 37.3230, -121.9469, '(408) 446-9400'),
('Apple Store - Stanford Shopping Center', '180 El Camino Real', 'Palo Alto', 'CA', '94304', 37.4419, -122.1616, '(650) 324-6200')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE apple_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to stores and availability
CREATE POLICY "Allow public read access to apple_stores" ON apple_stores
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to product_availability" ON product_availability
    FOR SELECT USING (true);

-- Create policy for notifications (users can only see their own notifications)
CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (true); -- We'll implement proper auth later

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON apple_stores TO anon, authenticated;
GRANT SELECT ON product_availability TO anon, authenticated;
GRANT ALL ON notifications TO anon, authenticated;
