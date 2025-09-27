-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(600) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    instructor_id UUID REFERENCES users(id),
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES categories(id),
    level VARCHAR(50), -- beginner, intermediate, advanced
    duration INTEGER, -- in minutes
    language VARCHAR(100) DEFAULT 'English',
    price DECIMAL(10,2) DEFAULT 0.00,
    thumbnail_url TEXT,
    promo_video_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Course content
CREATE TABLE course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    title VARCHAR(500) NOT NULL,
    order_index INTEGER NOT NULL
);

CREATE TABLE course_lectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES course_sections(id),
    title VARCHAR(500) NOT NULL,
    video_url TEXT,
    duration INTEGER,
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT FALSE
);

-- Enrollment system
CREATE TABLE enrollments (
    id UUID PRIMARY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    UNIQUE(user_id, course_id)
);