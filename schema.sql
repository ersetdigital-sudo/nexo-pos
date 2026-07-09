-- ========================================
-- Nexo POS Database Schema
-- Database: u562746374_nexopos
-- ========================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL DEFAULT 'Makanan',
  image VARCHAR(10) DEFAULT '',
  image_url TEXT,
  barcode VARCHAR(50),
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Product variations
CREATE TABLE IF NOT EXISTS product_variations (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Variation options
CREATE TABLE IF NOT EXISTS variation_options (
  id VARCHAR(50) PRIMARY KEY,
  variation_id VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  price_adjustment DECIMAL(12,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  loyalty_points INT NOT NULL DEFAULT 0,
  total_spent DECIMAL(15,2) NOT NULL DEFAULT 0,
  visit_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tables (meja)
CREATE TABLE IF NOT EXISTS tables_meja (
  id VARCHAR(50) PRIMARY KEY,
  number INT NOT NULL,
  seats INT NOT NULL DEFAULT 4,
  status ENUM('available', 'occupied', 'reserved') NOT NULL DEFAULT 'available',
  current_order_id VARCHAR(50),
  qr_code TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL,
  total DECIMAL(15,2) NOT NULL DEFAULT 0,
  status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  payment_method ENUM('cash', 'qris', 'card') NOT NULL DEFAULT 'cash',
  table_number INT,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  loyalty_points_earned INT NOT NULL DEFAULT 0,
  loyalty_points_used INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  selected_variations JSON,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ingredient stock
CREATE TABLE IF NOT EXISTS ingredient_stock (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  current_stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  minimum_stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  cost_per_unit DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Product ingredients (many-to-many)
CREATE TABLE IF NOT EXISTS product_ingredients (
  product_id VARCHAR(50) NOT NULL,
  ingredient_id VARCHAR(50) NOT NULL,
  quantity_used DECIMAL(10,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, ingredient_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredient_stock(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('store_name', 'Dapur Bunda'),
('store_phone', '08123456789'),
('tax_rate', '0.11'),
('loyalty_points_per_amount', '10000');

-- Insert sample products
INSERT INTO products (id, name, price, category, image, image_url, barcode, stock) VALUES
('1', 'Nasi Goreng Spesial', 25000, 'Makanan', '🍛', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop', '8901234567890', 50),
('2', 'Mie Ayam Bakso', 20000, 'Makanan', '🍜', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop', '8901234567891', 40),
('3', 'Ayam Geprek', 22000, 'Makanan', '🍗', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop', '8901234567892', 35),
('4', 'Es Teh Manis', 5000, 'Minuman', '🧋', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop', '8901234567893', 100),
('5', 'Es Jeruk Segar', 8000, 'Minuman', '🍊', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop', '8901234567894', 80),
('6', 'Kopi Susu Gula Aren', 18000, 'Minuman', '☕', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', '8901234567895', 60),
('7', 'Sate Ayam 10 Tusuk', 30000, 'Makanan', '🍢', 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=200&h=200&fit=crop', '8901234567896', 25),
('8', 'Gado-Gado', 18000, 'Makanan', '🥗', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop', '8901234567897', 30),
('9', 'Roti Bakar Coklat', 15000, 'Snack', '🍞', 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200&h=200&fit=crop', '8901234567898', 45),
('10', 'Pisang Goreng Keju', 12000, 'Snack', '🍌', 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=200&h=200&fit=crop', '8901234567899', 50),
('11', 'Tahu Crispy', 10000, 'Snack', '🧀', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop', '8901234567900', 60),
('12', 'Jus Alpukat', 15000, 'Minuman', '🥑', 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=200&h=200&fit=crop', '8901234567901', 40);

-- Insert product variations
INSERT INTO product_variations (id, product_id, name) VALUES
('v1', '1', 'Level Pedas'),
('v2', '3', 'Sambal'),
('v3', '6', 'Ukuran'),
('v4', '6', 'Suhu');

-- Insert variation options
INSERT INTO variation_options (id, variation_id, label, price_adjustment) VALUES
('o1', 'v1', 'Tidak Pedas', 0),
('o2', 'v1', 'Sedang', 0),
('o3', 'v1', 'Pedas', 2000),
('o4', 'v1', 'Extra Pedas', 3000),
('o5', 'v2', 'Sambal Matah', 0),
('o6', 'v2', 'Sambal Bawang', 0),
('o7', 'v2', 'Sambal Ijo', 2000),
('o8', 'v3', 'Regular', 0),
('o9', 'v3', 'Large', 5000),
('o10', 'v4', 'Dingin', 0),
('o11', 'v4', 'Panas', 0);

-- Insert sample tables (12 meja)
INSERT INTO tables_meja (id, number, seats, status) VALUES
('table-1', 1, 2, 'available'),
('table-2', 2, 2, 'available'),
('table-3', 3, 2, 'available'),
('table-4', 4, 2, 'available'),
('table-5', 5, 4, 'available'),
('table-6', 6, 4, 'available'),
('table-7', 7, 4, 'available'),
('table-8', 8, 4, 'available'),
('table-9', 9, 6, 'available'),
('table-10', 10, 6, 'available'),
('table-11', 11, 6, 'available'),
('table-12', 12, 6, 'available');

-- Insert sample ingredient stock
INSERT INTO ingredient_stock (id, name, current_stock, unit, minimum_stock, cost_per_unit) VALUES
('ing1', 'Beras', 50, 'kg', 10, 12000),
('ing2', 'Mie Telur', 100, 'bungkus', 20, 3000),
('ing3', 'Ayam', 30, 'kg', 5, 35000),
('ing4', 'Telur', 200, 'butir', 50, 2500),
('ing5', 'Gula Aren', 10, 'kg', 2, 45000),
('ing6', 'Kopi Robusta', 5, 'kg', 1, 80000),
('ing7', 'Susu Segar', 20, 'liter', 5, 18000),
('ing8', 'Minyak Goreng', 15, 'liter', 3, 17000);

-- Insert sample customers
INSERT INTO customers (id, name, phone, loyalty_points, total_spent, visit_count) VALUES
('c1', 'Budi Santoso', '08123456789', 250, 500000, 12),
('c2', 'Siti Rahayu', '08234567890', 180, 360000, 8),
('c3', 'Ahmad Wijaya', '08345678901', 420, 840000, 20);


-- Display cart (for real-time customer display across devices)
CREATE TABLE IF NOT EXISTS display_cart (
  id VARCHAR(100) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  product_image VARCHAR(10) DEFAULT '',
  quantity INT NOT NULL DEFAULT 1,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  selected_variations JSON,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
