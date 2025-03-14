CREATE DATABASE IF NOT EXISTS property_management;
USE property_management;

CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  type ENUM('residential', 'commercial') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_type ON properties(type);

CREATE TABLE IF NOT EXISTS utilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  type ENUM('electricity', 'water', 'gas') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_utility_property ON utilities(property_id);
CREATE INDEX idx_utility_type ON utilities(type);
CREATE INDEX idx_utility_date ON utilities(date);