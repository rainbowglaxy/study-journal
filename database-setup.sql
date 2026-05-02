-- 创建学习记录表
CREATE TABLE IF NOT EXISTS study_records (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  subject TEXT NOT NULL,
  mood INTEGER NOT NULL DEFAULT 1,
  duration DECIMAL(4,1),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建自定义科目表
CREATE TABLE IF NOT EXISTS custom_subjects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建照片表
CREATE TABLE IF NOT EXISTS record_photos (
  id BIGSERIAL PRIMARY KEY,
  record_id BIGINT REFERENCES study_records(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_study_records_date ON study_records(date);
CREATE INDEX IF NOT EXISTS idx_study_records_subject ON study_records(subject);
CREATE INDEX IF NOT EXISTS idx_record_photos_record_id ON record_photos(record_id);

-- 启用行级安全策略
ALTER TABLE study_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_photos ENABLE ROW LEVEL SECURITY;

-- 创建公开访问策略（暂时允许所有访问，生产环境需要限制）
CREATE POLICY "Allow all operations on study_records" ON study_records FOR ALL USING (true);
CREATE POLICY "Allow all operations on custom_subjects" ON custom_subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations on record_photos" ON record_photos FOR ALL USING (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_study_records_updated_at
    BEFORE UPDATE ON study_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
