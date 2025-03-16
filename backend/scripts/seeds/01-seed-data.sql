-- Add default admin user (password is 'admin123')
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@example.com', '$2b$12$/R4oT9zCucUCqk/SGV.XbeuAVzaz3xVT7an/m1/RmdWyXcdInj4cO', 'System Administrator', 'admin');

-- Seed properties
INSERT INTO properties (name, address, type) VALUES
('Kivukoni Apartments', '123 Kivukoni Road, Dar es Salaam, Tanzania', 'residential'),
('Mikocheni Villas', '456 Mikocheni Street, Dar es Salaam, Tanzania', 'residential'),
('Kariakoo Market Complex', '789 Kariakoo Road, Dar es Salaam, Tanzania', 'commercial'),
('Arusha Hillside Homes', '101 Hillside Drive, Arusha, Tanzania', 'residential'),
('Mwanza Business Park', '202 Lakeview Road, Mwanza, Tanzania', 'commercial');

-- Seed utilities
-- For Kivukoni Apartments (ID: 1)
INSERT INTO utilities (property_id, type, amount, date) VALUES
(1, 'electricity', 250000.00, '2024-01-15'), -- Amount in TZS
(1, 'water', 120000.00, '2024-01-15'),
(1, 'gas', 80000.00, '2024-01-15'),
(1, 'electricity', 245000.00, '2024-02-15'),
(1, 'water', 118000.00, '2024-02-15'),
(1, 'gas', 78000.00, '2024-02-15');

-- For Mikocheni Villas (ID: 2)
INSERT INTO utilities (property_id, type, amount, date) VALUES
(2, 'electricity', 300000.00, '2024-01-10'),
(2, 'water', 150000.00, '2024-01-10'),
(2, 'gas', 90000.00, '2024-01-10'),
(2, 'electricity', 310000.00, '2024-02-10'),
(2, 'water', 155000.00, '2024-02-10'),
(2, 'gas', 92000.00, '2024-02-10');

-- For Kariakoo Market Complex (ID: 3)
INSERT INTO utilities (property_id, type, amount, date) VALUES
(3, 'electricity', 1200000.00, '2024-01-05'), -- Commercial property utilities are higher
(3, 'water', 300000.00, '2024-01-05'),
(3, 'gas', 400000.00, '2024-01-05'),
(3, 'electricity', 1220000.00, '2024-02-05'),
(3, 'water', 310000.00, '2024-02-05'),
(3, 'gas', 390000.00, '2024-02-05');

-- For Arusha Hillside Homes (ID: 4)
INSERT INTO utilities (property_id, type, amount, date) VALUES
(4, 'electricity', 180000.00, '2024-01-20'),
(4, 'water', 90000.00, '2024-01-20'),
(4, 'gas', 60000.00, '2024-01-20'),
(4, 'electricity', 175000.00, '2024-02-20'),
(4, 'water', 88000.00, '2024-02-20'),
(4, 'gas', 59000.00, '2024-02-20');

-- For Mwanza Business Park (ID: 5)
INSERT INTO utilities (property_id, type, amount, date) VALUES
(5, 'electricity', 950000.00, '2024-01-25'),
(5, 'water', 200000.00, '2024-01-25'),
(5, 'gas', 350000.00, '2024-01-25'),
(5, 'electricity', 960000.00, '2024-02-25'),
(5, 'water', 210000.00, '2024-02-25'),
(5, 'gas', 345000.00, '2024-02-25');