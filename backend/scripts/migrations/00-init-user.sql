CREATE DATABASE IF NOT EXISTS property_managements;
CREATE USER IF NOT EXISTS 'pms_user'@'%' IDENTIFIED BY 'root123';

GRANT ALL PRIVILEGES ON property_managements.* TO 'pms_user'@'%';

FLUSH PRIVILEGES;
