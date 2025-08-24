-- AI Career Assistant Database Schema
-- Core tables for user profiles, skills, jobs, and recommendations

-- Users table for authentication and basic profile
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(20),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    target_role VARCHAR(255),
    target_salary_min INTEGER,
    target_salary_max INTEGER,
    experience_level VARCHAR(50) CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills master table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'technical', 'soft', 'industry', 'tool'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills with proficiency levels
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5), -- 1=Beginner, 5=Expert
    years_experience DECIMAL(3,1),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Work experience
CREATE TABLE IF NOT EXISTS work_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for current position
    is_current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    achievements TEXT[], -- Array of achievement strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    honors VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table for job postings
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255), -- ID from job board API
    source VARCHAR(100) NOT NULL, -- 'adzuna', 'arbeitnow', etc.
    title VARCHAR(500) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    salary_min INTEGER,
    salary_max INTEGER,
    employment_type VARCHAR(50), -- 'full-time', 'part-time', 'contract', 'internship'
    remote_allowed BOOLEAN DEFAULT FALSE,
    posted_date DATE,
    application_url VARCHAR(1000),
    required_skills TEXT[], -- Array of skill names
    preferred_skills TEXT[], -- Array of skill names
    experience_level VARCHAR(50),
    embedding VECTOR(1536), -- For similarity search (OpenAI embeddings)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(external_id, source)
);

-- Job recommendations for users
CREATE TABLE IF NOT EXISTS job_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    match_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    missing_skills TEXT[], -- Skills user lacks for this job
    recommendation_reason TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'applied', 'rejected', 'saved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    provider VARCHAR(255) NOT NULL, -- 'Coursera', 'Udemy', etc.
    description TEXT,
    url VARCHAR(1000) NOT NULL,
    duration_hours INTEGER,
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    rating DECIMAL(3,2),
    skills_taught TEXT[], -- Array of skill names
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User course completions
CREATE TABLE IF NOT EXISTS user_course_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    score INTEGER, -- Percentage score if available
    certificate_url VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    technologies_used TEXT[], -- Array of technology names
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'in-progress' CHECK (status IN ('planned', 'in-progress', 'completed', 'on-hold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table for storing generated resumes
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    content JSONB NOT NULL, -- Structured resume data
    html_content TEXT,
    pdf_url VARCHAR(1000),
    ats_score DECIMAL(5,2), -- ATS compatibility score
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career roadmaps
CREATE TABLE IF NOT EXISTS career_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_role VARCHAR(255) NOT NULL,
    current_role VARCHAR(255),
    timeline_months INTEGER NOT NULL,
    milestones JSONB NOT NULL, -- Array of milestone objects
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates and badges
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certificate_url VARCHAR(1000),
    verification_code VARCHAR(100) UNIQUE,
    badge_data JSONB, -- OpenBadges metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview sessions for tracking practice
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_role VARCHAR(255) NOT NULL,
    questions JSONB NOT NULL, -- Array of question objects
    responses JSONB, -- Array of response objects
    scores JSONB, -- Scoring data
    feedback TEXT,
    duration_minutes INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_job_recommendations_user_id ON job_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_job_recommendations_match_score ON job_recommendations(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_career_roadmaps_user_id ON career_roadmaps(user_id);
