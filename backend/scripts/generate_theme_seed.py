import json
import os

# List of themes to include (matching the plan)
THEMES_TO_SEED = [
    "modern-bistro",
    "warm-comfort",
    "vibrant-energy",
    "elegant-simplicity",
    "urban-fresh",
    "coastal-breeze",
    "spicy-fusion",
    "garden-fresh",
    "premium-dark",
    "playful-pop"
]

THEMES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../themes"))
MIGRATION_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../migrations/078_seed_production_themes.sql"))

def generate_sql():
    sql_header = """-- ============================================================
-- Migration 078: Seed 10 Production Theme Presets
-- Date: 2026-01-20
-- Purpose: Insert production-ready theme templates into theme_presets with Bilingual Support
-- ============================================================

-- Insert 10 production themes into theme_presets table
INSERT INTO theme_presets (name, slug, category, description, preset_data, sort_order) VALUES
"""
    
    values = []
    
    print(f"Reading themes from: {THEMES_DIR}")
    
    for idx, slug in enumerate(THEMES_TO_SEED):
        theme_path = os.path.join(THEMES_DIR, slug, "theme.json")
        if not os.path.exists(theme_path):
            print(f"Warning: Theme {slug} not found at {theme_path}")
            continue
            
        with open(theme_path, "r", encoding="utf-8") as f:
            theme_data = json.load(f)
            
        # Extract meta info for columns
        meta = theme_data.get("meta", {})
        name = meta.get("name", slug)
        category = meta.get("category", "professional")
        description = meta.get("description", "")
        
        # preset_data is the whole JSON (or should we strip meta? existing migration included it)
        # Let's keep it complete as the app might use it.
        # We need to escape single quotes in JSON for SQL
        json_str = json.dumps(theme_data, ensure_ascii=False)
        # Use $$ quoting for JSON to avoid escaping hell
        
        value = f"""(
    '{name.replace("'", "''")}',
    '{slug}',
    '{category}',
    '{description.replace("'", "''")}',
    $${json_str}$$::jsonb,
    {idx + 7}
)"""
        values.append(value)

    sql_footer = """
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    preset_data = EXCLUDED.preset_data,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP;
"""

    full_sql = sql_header + ",\n".join(values) + sql_footer
    
    with open(MIGRATION_FILE, "w", encoding="utf-8") as f:
        f.write(full_sql)
        
    print(f"Successfully generated migration file at: {MIGRATION_FILE}")

if __name__ == "__main__":
    generate_sql()
