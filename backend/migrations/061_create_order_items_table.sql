-- Create order_items table for individual line items in orders
-- Each order can have multiple items with variants and add-ons

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_id BIGINT,

    -- Product Information
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(255),

    -- Quantity and Pricing
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,

    -- Special Instructions
    special_instructions TEXT,

    -- Add-ons (stored as JSON array)
    -- Example: [{"id": 1, "name": "Extra Cheese", "price": 2.50, "quantity": 1}]
    addons JSON,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,

    -- Check constraints
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_prices_non_negative CHECK (unit_price >= 0 AND total_price >= 0)
);

-- Create indexes for fast queries
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_variant_id ON order_items(variant_id);

-- Add comments for documentation
COMMENT ON TABLE order_items IS 'Line items in orders. Each order contains one or more items with optional variants and add-ons.';
COMMENT ON COLUMN order_items.addons IS 'JSON array of add-ons selected for this item. Format: [{"id": 1, "name": "Extra Cheese", "price": 2.50, "quantity": 1}]';
COMMENT ON COLUMN order_items.special_instructions IS 'Customer special instructions for this specific item (e.g., "no onions", "extra sauce")';
