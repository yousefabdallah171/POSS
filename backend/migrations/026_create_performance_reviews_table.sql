-- Migration: Create performance_reviews table
-- Description: Track employee performance reviews and evaluations
-- Created: 2025-12-24

CREATE TABLE IF NOT EXISTS performance_reviews (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    -- Review Period
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    review_type VARCHAR(20) NOT NULL CHECK (review_type IN ('probation', 'annual', 'mid_year', 'quarterly', 'ad_hoc')),

    -- Reviewer Information
    reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(200),
    reviewer_position VARCHAR(100),

    -- Overall Rating
    overall_rating DECIMAL(3,2) CHECK (overall_rating >= 0 AND overall_rating <= 5),
    -- Rating scale: 1 = Poor, 2 = Below Average, 3 = Average, 4 = Good, 5 = Excellent

    -- Performance Categories
    quality_of_work DECIMAL(3,2) CHECK (quality_of_work >= 0 AND quality_of_work <= 5),
    productivity DECIMAL(3,2) CHECK (productivity >= 0 AND productivity <= 5),
    communication DECIMAL(3,2) CHECK (communication >= 0 AND communication <= 5),
    teamwork DECIMAL(3,2) CHECK (teamwork >= 0 AND teamwork <= 5),
    punctuality DECIMAL(3,2) CHECK (punctuality >= 0 AND punctuality <= 5),
    attendance DECIMAL(3,2) CHECK (attendance >= 0 AND attendance <= 5),
    initiative DECIMAL(3,2) CHECK (initiative >= 0 AND initiative <= 5),
    problem_solving DECIMAL(3,2) CHECK (problem_solving >= 0 AND problem_solving <= 5),
    customer_service DECIMAL(3,2) CHECK (customer_service >= 0 AND customer_service <= 5),
    technical_skills DECIMAL(3,2) CHECK (technical_skills >= 0 AND technical_skills <= 5),
    leadership DECIMAL(3,2) CHECK (leadership >= 0 AND leadership <= 5),
    adaptability DECIMAL(3,2) CHECK (adaptability >= 0 AND adaptability <= 5),

    -- Custom Ratings (JSONB for flexible criteria)
    custom_ratings JSONB DEFAULT '{}',
    -- Example: {"food_safety": 4.5, "menu_knowledge": 4.0}

    -- Feedback
    strengths TEXT,
    areas_for_improvement TEXT,
    achievements TEXT,
    goals_met TEXT,
    goals_not_met TEXT,

    -- Goals and Action Plan
    future_goals TEXT,
    action_plan TEXT,
    training_recommendations TEXT,
    development_plan TEXT,

    -- Comments
    reviewer_comments TEXT NOT NULL,
    employee_comments TEXT,
    hr_comments TEXT,

    -- Recommendations
    promotion_recommended BOOLEAN DEFAULT false,
    promotion_details TEXT,
    salary_increase_recommended BOOLEAN DEFAULT false,
    recommended_increase_percentage DECIMAL(5,2),
    recommended_increase_amount DECIMAL(10,2),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'acknowledged', 'disputed', 'finalized')),
    is_finalized BOOLEAN DEFAULT false,
    finalized_at TIMESTAMP WITH TIME ZONE,
    finalized_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Employee Acknowledgement
    employee_acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    employee_signature TEXT, -- Can store digital signature or acknowledgement text

    -- Attachments
    attachments JSONB DEFAULT '[]',
    -- Example: [{"filename": "goals.pdf", "url": "..."}]

    -- Next Review
    next_review_date DATE,

    -- System Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT valid_review_period CHECK (review_period_end >= review_period_start),
    CONSTRAINT valid_review_date CHECK (review_date >= review_period_end),
    CONSTRAINT valid_increase_percentage CHECK (recommended_increase_percentage IS NULL OR recommended_increase_percentage >= 0)
);

-- Indexes for performance
CREATE INDEX idx_performance_reviews_tenant_restaurant ON performance_reviews(tenant_id, restaurant_id);
CREATE INDEX idx_performance_reviews_employee ON performance_reviews(employee_id);
CREATE INDEX idx_performance_reviews_period ON performance_reviews(review_period_start, review_period_end);
CREATE INDEX idx_performance_reviews_date ON performance_reviews(review_date);
CREATE INDEX idx_performance_reviews_reviewer ON performance_reviews(reviewer_id);
CREATE INDEX idx_performance_reviews_status ON performance_reviews(status);
CREATE INDEX idx_performance_reviews_type ON performance_reviews(review_type);
CREATE INDEX idx_performance_reviews_rating ON performance_reviews(overall_rating);
CREATE INDEX idx_performance_reviews_pending ON performance_reviews(employee_acknowledged) WHERE employee_acknowledged = false;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_performance_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_performance_reviews_updated_at
    BEFORE UPDATE ON performance_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_performance_reviews_updated_at();

-- Trigger to calculate overall rating from category ratings
CREATE OR REPLACE FUNCTION calculate_overall_rating()
RETURNS TRIGGER AS $$
DECLARE
    rating_count INTEGER := 0;
    rating_sum DECIMAL := 0;
BEGIN
    -- Calculate average of all non-null category ratings
    IF NEW.quality_of_work IS NOT NULL THEN
        rating_sum := rating_sum + NEW.quality_of_work;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.productivity IS NOT NULL THEN
        rating_sum := rating_sum + NEW.productivity;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.communication IS NOT NULL THEN
        rating_sum := rating_sum + NEW.communication;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.teamwork IS NOT NULL THEN
        rating_sum := rating_sum + NEW.teamwork;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.punctuality IS NOT NULL THEN
        rating_sum := rating_sum + NEW.punctuality;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.attendance IS NOT NULL THEN
        rating_sum := rating_sum + NEW.attendance;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.initiative IS NOT NULL THEN
        rating_sum := rating_sum + NEW.initiative;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.problem_solving IS NOT NULL THEN
        rating_sum := rating_sum + NEW.problem_solving;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.customer_service IS NOT NULL THEN
        rating_sum := rating_sum + NEW.customer_service;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.technical_skills IS NOT NULL THEN
        rating_sum := rating_sum + NEW.technical_skills;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.leadership IS NOT NULL THEN
        rating_sum := rating_sum + NEW.leadership;
        rating_count := rating_count + 1;
    END IF;
    IF NEW.adaptability IS NOT NULL THEN
        rating_sum := rating_sum + NEW.adaptability;
        rating_count := rating_count + 1;
    END IF;

    -- Calculate overall rating if we have at least one category rating
    IF rating_count > 0 THEN
        NEW.overall_rating := ROUND((rating_sum / rating_count)::numeric, 2);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_overall_rating
    BEFORE INSERT OR UPDATE ON performance_reviews
    FOR EACH ROW
    EXECUTE FUNCTION calculate_overall_rating();

-- Comments for documentation
COMMENT ON TABLE performance_reviews IS 'Tracks employee performance reviews and evaluations';
COMMENT ON COLUMN performance_reviews.overall_rating IS 'Average of all category ratings (1-5 scale)';
COMMENT ON COLUMN performance_reviews.review_type IS 'Type of review: probation, annual, mid_year, quarterly, ad_hoc';
COMMENT ON COLUMN performance_reviews.custom_ratings IS 'JSON object for additional custom rating criteria';
COMMENT ON COLUMN performance_reviews.employee_signature IS 'Digital signature or acknowledgement text';
