-- 피드백 테이블
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('test_idea', 'feature', 'bug_report', 'design', 'mobile', 'other')),
    visibility VARCHAR(20) NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'anonymous')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'replied', 'rejected')),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    attached_file_url TEXT,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_reply TEXT,
    admin_reply_at TIMESTAMP WITH TIME ZONE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 피드백 댓글 테이블
CREATE TABLE IF NOT EXISTS feedback_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 피드백 신고 테이블 (스팸 방지용)
CREATE TABLE IF NOT EXISTS feedback_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reporter_ip INET,
    reason VARCHAR(20) NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'other')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 작성 제한 추적 테이블 (IP 기반)
CREATE TABLE IF NOT EXISTS feedback_rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_ip INET,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('create_feedback', 'create_comment')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_feedbacks_category ON feedbacks(category);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_visibility ON feedbacks(visibility);
CREATE INDEX IF NOT EXISTS idx_feedbacks_author_id ON feedbacks(author_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_comments_feedback_id ON feedback_comments(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_comments_created_at ON feedback_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_feedback_id ON feedback_reports(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rate_limits_user_id ON feedback_rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rate_limits_user_ip ON feedback_rate_limits(user_ip);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feedbacks_updated_at 
    BEFORE UPDATE ON feedbacks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_rate_limits ENABLE ROW LEVEL SECURITY;

-- 피드백 RLS 정책
-- 1. 모든 사용자는 public, anonymous 피드백을 볼 수 있음
-- 2. 작성자는 자신의 private 피드백을 볼 수 있음
-- 3. 관리자는 모든 피드백을 볼 수 있음 (추후 구현)
CREATE POLICY "Anyone can view public feedbacks" ON feedbacks
    FOR SELECT USING (
        visibility IN ('public', 'anonymous') 
        OR author_id = auth.uid()
    );

-- 인증된 사용자는 피드백을 작성할 수 있음
CREATE POLICY "Authenticated users can create feedbacks" ON feedbacks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 작성자는 자신의 피드백을 수정할 수 있음
CREATE POLICY "Authors can update their feedbacks" ON feedbacks
    FOR UPDATE USING (author_id = auth.uid());

-- 작성자는 자신의 피드백을 삭제할 수 있음
CREATE POLICY "Authors can delete their feedbacks" ON feedbacks
    FOR DELETE USING (author_id = auth.uid());

-- 댓글 RLS 정책
-- 피드백을 볼 수 있는 사용자는 댓글도 볼 수 있음
CREATE POLICY "Users can view comments for accessible feedbacks" ON feedback_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM feedbacks 
            WHERE feedbacks.id = feedback_comments.feedback_id
            AND (
                feedbacks.visibility IN ('public', 'anonymous')
                OR feedbacks.author_id = auth.uid()
            )
        )
    );

-- 인증된 사용자는 댓글을 작성할 수 있음
CREATE POLICY "Authenticated users can create comments" ON feedback_comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 작성자는 자신의 댓글을 삭제할 수 있음
CREATE POLICY "Authors can delete their comments" ON feedback_comments
    FOR DELETE USING (author_id = auth.uid());

-- 신고 RLS 정책
-- 인증된 사용자는 신고를 작성할 수 있음
CREATE POLICY "Authenticated users can create reports" ON feedback_reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 제한 추적 RLS 정책
-- 사용자는 자신의 제한 기록만 볼 수 있음
CREATE POLICY "Users can view their own rate limits" ON feedback_rate_limits
    FOR SELECT USING (user_id = auth.uid());

-- 시스템은 제한 기록을 생성할 수 있음
CREATE POLICY "System can create rate limit records" ON feedback_rate_limits
    FOR INSERT WITH CHECK (true); 