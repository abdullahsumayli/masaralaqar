CREATE TABLE unanswered_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_id UUID REFERENCES offices(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  asked_by_phone TEXT,
  times_asked INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending', -- pending | answered | ignored
  answer TEXT,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE unanswered_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "office_own_questions" ON unanswered_questions
  FOR ALL USING (
    office_id IN (
      SELECT id FROM offices WHERE user_id = auth.uid()
    )
  );

-- index للبحث السريع
CREATE INDEX idx_unanswered_office ON unanswered_questions(office_id, status);
CREATE INDEX idx_unanswered_question ON unanswered_questions(office_id, question);

