-- ============================================================
-- Migration 078: Seed 10 Production Theme Presets
-- Date: 2026-01-08
-- Purpose: Insert production-ready theme templates into theme_presets
-- ============================================================

-- Insert 10 production themes into theme_presets table
INSERT INTO theme_presets (name, slug, category, description, preset_data, sort_order) VALUES
(
    'Modern Bistro',
    'modern-bistro',
    'professional',
    'Contemporary minimalist design with clean typography',
    $${"name":"Modern Bistro","slug":"modern-bistro","colors":{"primary":"#2563eb","secondary":"#059669","accent":"#db2777","background":"#ffffff","text":"#111827","border":"#e5e7eb","shadow":"#000000"},"typography":{"font_family":"Inter, system-ui, sans-serif","base_font_size":16,"line_height":1.6,"border_radius":8},"identity":{"site_title":"Modern Bistro","logo_url":"https://cdn.example.com/logos/modern-bistro.svg","favicon_url":"https://cdn.example.com/favicons/modern-bistro.ico"},"header":{"style":"modern","sticky_nav":true,"show_search":true,"show_language":true,"background_color":"#2563eb","text_color":"#ffffff","height":64,"padding":16},"footer":{"style":"extended","columns":4,"show_social":true,"company_name":"Modern Bistro","background_color":"#1f2937","text_color":"#ffffff"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"cta-1","type":"cta","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4}]}$$::jsonb,
    7
),
(
    'Warm Comfort',
    'warm-comfort',
    'professional',
    'Cozy, traditional design with warm colors',
    $${"name":"Warm Comfort","slug":"warm-comfort","colors":{"primary":"#b45309","secondary":"#92400e","accent":"#fbbf24","background":"#fffbeb","text":"#78350f","border":"#fed7aa","shadow":"#000000"},"typography":{"font_family":"Georgia, serif","base_font_size":17,"line_height":1.7,"border_radius":4},"identity":{"site_title":"Warm Comfort Restaurant","logo_url":"https://cdn.example.com/logos/warm-comfort.svg","favicon_url":"https://cdn.example.com/favicons/warm-comfort.ico"},"header":{"style":"classic","sticky_nav":true,"show_search":false,"show_language":true,"background_color":"#b45309","text_color":"#ffffff","height":64,"padding":16},"footer":{"style":"classic","columns":3,"show_social":true,"company_name":"Warm Comfort Restaurant","background_color":"#78350f","text_color":"#ffffff"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"why-choose-1","type":"why-choose-us","enabled":true,"order":2},{"id":"featured-1","type":"featured-items","enabled":true,"order":3},{"id":"cta-1","type":"cta","enabled":true,"order":4}]}$$::jsonb,
    8
),
(
    'Vibrant Energy',
    'vibrant-energy',
    'creative',
    'Bold, modern colors with high energy design',
    $${"name":"Vibrant Energy","slug":"vibrant-energy","colors":{"primary":"#ec4899","secondary":"#8b5cf6","accent":"#f59e0b","background":"#f0f9ff","text":"#1e293b","border":"#cbd5e1","shadow":"#000000"},"typography":{"font_family":"Poppins, sans-serif","base_font_size":16,"line_height":1.5,"border_radius":12},"identity":{"site_title":"Vibrant Energy","logo_url":"https://cdn.example.com/logos/vibrant-energy.svg","favicon_url":"https://cdn.example.com/favicons/vibrant-energy.ico"},"header":{"style":"modern","sticky_nav":true,"show_search":true,"show_language":true,"background_color":"#ec4899","text_color":"#ffffff","height":72,"padding":20},"footer":{"style":"modern","columns":4,"show_social":true,"company_name":"Vibrant Energy","background_color":"#1e293b","text_color":"#ffffff"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4},{"id":"cta-1","type":"cta","enabled":true,"order":5}]}$$::jsonb,
    9
),
(
    'Elegant Simplicity',
    'elegant-simplicity',
    'minimal',
    'Luxury, minimal design with elegant touches',
    $${"name":"Elegant Simplicity","slug":"elegant-simplicity","colors":{"primary":"#6366f1","secondary":"#8b5cf6","accent":"#ec4899","background":"#f8fafc","text":"#0f172a","border":"#e2e8f0","shadow":"#000000"},"typography":{"font_family":"Playfair Display, serif","base_font_size":18,"line_height":1.7,"border_radius":0},"identity":{"site_title":"Elegant Simplicity","logo_url":"https://cdn.example.com/logos/elegant-simplicity.svg","favicon_url":"https://cdn.example.com/favicons/elegant-simplicity.ico"},"header":{"style":"elegant","sticky_nav":true,"show_search":false,"show_language":true,"background_color":"#f8fafc","text_color":"#0f172a","height":80,"padding":24},"footer":{"style":"elegant","columns":3,"show_social":true,"company_name":"Elegant Simplicity","background_color":"#0f172a","text_color":"#f1f5f9"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4}]}$$::jsonb,
    10
),
(
    'Urban Fresh',
    'urban-fresh',
    'modern',
    'Tech-forward, bright design for modern urban dining',
    $${"name":"Urban Fresh","slug":"urban-fresh","colors":{"primary":"#10b981","secondary":"#06b6d4","accent":"#f59e0b","background":"#ffffff","text":"#1e293b","border":"#e2e8f0","shadow":"#000000"},"typography":{"font_family":"Roboto, sans-serif","base_font_size":16,"line_height":1.6,"border_radius":6},"identity":{"site_title":"Urban Fresh","logo_url":"https://cdn.example.com/logos/urban-fresh.svg","favicon_url":"https://cdn.example.com/favicons/urban-fresh.ico"},"header":{"style":"modern","sticky_nav":true,"show_search":true,"show_language":true,"background_color":"#10b981","text_color":"#ffffff","height":68,"padding":18},"footer":{"style":"modern","columns":4,"show_social":true,"company_name":"Urban Fresh","background_color":"#1e293b","text_color":"#ffffff"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"cta-1","type":"cta","enabled":true,"order":4},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":5}]}$$::jsonb,
    11
),
(
    'Coastal Breeze',
    'coastal-breeze',
    'creative',
    'Beach/seafood restaurant with coastal design elements',
    $${"name":"Coastal Breeze","slug":"coastal-breeze","colors":{"primary":"#0ea5e9","secondary":"#06b6d4","accent":"#f97316","background":"#f0f9ff","text":"#0c4a6e","border":"#bae6fd","shadow":"#000000"},"typography":{"font_family":"Lora, serif","base_font_size":17,"line_height":1.6,"border_radius":8},"identity":{"site_title":"Coastal Breeze","logo_url":"https://cdn.example.com/logos/coastal-breeze.svg","favicon_url":"https://cdn.example.com/favicons/coastal-breeze.ico"},"header":{"style":"coastal","sticky_nav":true,"show_search":true,"show_language":true,"background_color":"#0ea5e9","text_color":"#ffffff","height":70,"padding":20},"footer":{"style":"coastal","columns":4,"show_social":true,"company_name":"Coastal Breeze","background_color":"#0c4a6e","text_color":"#ffffff"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4},{"id":"cta-1","type":"cta","enabled":true,"order":5}]}$$::jsonb,
    12
),
(
    'Spicy Fusion',
    'spicy-fusion',
    'creative',
    'International cuisine with fusion design elements',
    $${"name":"Spicy Fusion","slug":"spicy-fusion","colors":{"primary":"#dc2626","secondary":"#ea580c","accent":"#ca8a04","background":"#fef7f0","text":"#431407","border":"#fdba74","shadow":"#000000"},"typography":{"font_family":"Nunito, sans-serif","base_font_size":16,"line_height":1.5,"border_radius":10},"identity":{"site_title":"Spicy Fusion","logo_url":"https://cdn.example.com/logos/spicy-fusion.svg","favicon_url":"https://cdn.example.com/favicons/spicy-fusion.ico"},"header":{"style":"fusion","sticky_nav":true,"show_search":true,"show_language":true,"background_color":"#dc2626","text_color":"#ffffff","height":72,"padding":20},"footer":{"style":"fusion","columns":4,"show_social":true,"company_name":"Spicy Fusion","background_color":"#431407","text_color":"#fef7f0"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4},{"id":"cta-1","type":"cta","enabled":true,"order":5}]}$$::jsonb,
    13
),
(
    'Garden Fresh',
    'garden-fresh',
    'professional',
    'Organic, vegetarian restaurant with natural design elements',
    $${"name":"Garden Fresh","slug":"garden-fresh","colors":{"primary":"#16a34a","secondary":"#22c55e","accent":"#eab308","background":"#f7fee7","text":"#14532d","border":"#bbf7d0","shadow":"#000000"},"typography":{"font_family":"Quicksand, sans-serif","base_font_size":16,"line_height":1.6,"border_radius":6},"identity":{"site_title":"Garden Fresh","logo_url":"https://cdn.example.com/logos/garden-fresh.svg","favicon_url":"https://cdn.example.com/favicons/garden-fresh.ico"},"header":{"style":"natural","sticky_nav":true,"show_search":true,"show_language":true,"background_color":"#16a34a","text_color":"#ffffff","height":68,"padding":18},"footer":{"style":"natural","columns":4,"show_social":true,"company_name":"Garden Fresh","background_color":"#14532d","text_color":"#f7fee7"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4},{"id":"cta-1","type":"cta","enabled":true,"order":5}]}$$::jsonb,
    14
),
(
    'Premium Dark',
    'premium-dark',
    'professional',
    'Fine dining, dark mode theme for upscale restaurants',
    $${"name":"Premium Dark","slug":"premium-dark","colors":{"primary":"#374151","secondary":"#6b7280","accent":"#f59e0b","background":"#0f172a","text":"#f1f5f9","border":"#334155","shadow":"#000000"},"typography":{"font_family":"Crimson Text, serif","base_font_size":18,"line_height":1.7,"border_radius":0},"identity":{"site_title":"Premium Dark","logo_url":"https://cdn.example.com/logos/premium-dark.svg","favicon_url":"https://cdn.example.com/favicons/premium-dark.ico"},"header":{"style":"premium","sticky_nav":true,"show_search":false,"show_language":true,"background_color":"#0f172a","text_color":"#f1f5f9","height":80,"padding":24},"footer":{"style":"premium","columns":3,"show_social":true,"company_name":"Premium Dark","background_color":"#0f172a","text_color":"#f1f5f9"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4}]}$$::jsonb,
    15
),
(
    'Playful Pop',
    'playful-pop',
    'creative',
    'Casual, colorful design for fun dining experiences',
    $${"name":"Playful Pop","slug":"playful-pop","colors":{"primary":"#ec4899","secondary":"#8b5cf6","accent":"#f59e0b","background":"#ffffff","text":"#1e293b","border":"#e2e8f0","shadow":"#000000"},"typography":{"font_family":"Comic Sans MS, cursive","base_font_size":18,"line_height":1.5,"border_radius":20},"identity":{"site_title":"Playful Pop","logo_url":"https://cdn.example.com/logos/playful-pop.svg","favicon_url":"https://cdn.example.com/favicons/playful-pop.ico"},"header":{"style":"playful","sticky_nav":true,"show_search":true,"show_language":true,"background_color":"#ec4899","text_color":"#ffffff","height":75,"padding":22},"footer":{"style":"playful","columns":4,"show_social":true,"company_name":"Playful Pop","background_color":"#1e293b","text_color":"#ffffff"},"components":[{"id":"hero-1","type":"hero","enabled":true,"order":1},{"id":"featured-1","type":"featured-items","enabled":true,"order":2},{"id":"info-cards-1","type":"info-cards","enabled":true,"order":3},{"id":"testimonials-1","type":"testimonials","enabled":true,"order":4},{"id":"cta-1","type":"cta","enabled":true,"order":5}]}$$::jsonb,
    16
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    preset_data = EXCLUDED.preset_data,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP;
