-- Create user if not exists
CREATE USER IF NOT EXISTS 'pms_user'@'%' IDENTIFIED BY 'root123';

-- Grant privileges
GRANT ALL PRIVILEGES ON property_management.* TO 'pms_user'@'%';
GRANT ALL PRIVILEGES ON property_management_test.* TO 'pms_user'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;
