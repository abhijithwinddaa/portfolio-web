-- Supabase Schema for Portfolio Admin

-- Note: JWT secret is managed by Supabase automatically
-- No need to set it manually

-- Create tables

-- Profile table
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT,
    about_me TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    resume_url TEXT,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT,
    issue_date DATE,
    expiry_date DATE,
    credential_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tech Stack table
CREATE TABLE IF NOT EXISTS public.tech_stack (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER DEFAULT 50,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    responsibilities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Links table
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Section Visibility table
CREATE TABLE IF NOT EXISTS public.section_visibility (
    id INTEGER PRIMARY KEY DEFAULT 1,
    about BOOLEAN DEFAULT TRUE,
    projects BOOLEAN DEFAULT TRUE,
    certificates BOOLEAN DEFAULT TRUE,
    techStack BOOLEAN DEFAULT TRUE,
    experience BOOLEAN DEFAULT TRUE,
    contact BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default section visibility
INSERT INTO public.section_visibility (id, about, projects, certificates, techStack, experience, contact)
VALUES (1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Comments table
CREATE TABLE IF NOT EXISTS public.portfolio_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    user_name TEXT NOT NULL,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
-- For now, we'll allow all operations for simplicity
-- In a production environment, you should restrict this to authenticated users with admin role

-- Profile policies
CREATE POLICY "Allow all operations on profile" ON public.profile
    USING (true) WITH CHECK (true);

-- Projects policies
CREATE POLICY "Allow all operations on projects" ON public.projects
    USING (true) WITH CHECK (true);

-- Certificates policies
CREATE POLICY "Allow all operations on certificates" ON public.certificates
    USING (true) WITH CHECK (true);

-- Tech Stack policies
CREATE POLICY "Allow all operations on tech_stack" ON public.tech_stack
    USING (true) WITH CHECK (true);

-- Experience policies
CREATE POLICY "Allow all operations on experience" ON public.experience
    USING (true) WITH CHECK (true);

-- Social Links policies
CREATE POLICY "Allow all operations on social_links" ON public.social_links
    USING (true) WITH CHECK (true);

-- Section Visibility policies
CREATE POLICY "Allow all operations on section_visibility" ON public.section_visibility
    USING (true) WITH CHECK (true);

-- Comments policies
CREATE POLICY "Allow read access to comments" ON public.portfolio_comments
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to comments" ON public.portfolio_comments
    FOR INSERT WITH CHECK (true);

-- Create storage buckets
-- Note: This needs to be done via the Supabase dashboard or API
-- You'll need to create the following buckets:
-- 1. profile-images
-- 2. project-images
-- 3. certificate-images
-- 4. tech-icons
-- 5. documents

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects (created_at DESC);
CREATE INDEX IF NOT EXISTS certificates_created_at_idx ON public.certificates (created_at DESC);
CREATE INDEX IF NOT EXISTS tech_stack_category_idx ON public.tech_stack (category);
CREATE INDEX IF NOT EXISTS experience_start_date_idx ON public.experience (start_date DESC);
CREATE INDEX IF NOT EXISTS portfolio_comments_created_at_idx ON public.portfolio_comments (created_at DESC);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profile_updated_at
BEFORE UPDATE ON public.profile
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tech_stack_updated_at
BEFORE UPDATE ON public.tech_stack
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experience_updated_at
BEFORE UPDATE ON public.experience
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_social_links_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_section_visibility_updated_at
BEFORE UPDATE ON public.section_visibility
FOR EACH ROW EXECUTE FUNCTION update_updated_at();