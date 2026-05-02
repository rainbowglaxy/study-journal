-- 数据库迁移：添加用户认证支持
-- 请在 Supabase Dashboard 的 SQL Editor 中执行此脚本

-- 1. 为 study_records 表添加 user_id 字段
ALTER TABLE study_records ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. 为 custom_subjects 表添加 user_id 字段
ALTER TABLE custom_subjects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 3. 删除旧的 RLS 策略
DROP POLICY IF EXISTS "Allow all operations on study_records" ON study_records;
DROP POLICY IF EXISTS "Allow all operations on custom_subjects" ON custom_subjects;
DROP POLICY IF EXISTS "Allow all operations on record_photos" ON record_photos;

-- 4. 创建新的 RLS 策略：用户只能访问自己的数据
CREATE POLICY "Users can only access own records" ON study_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access own subjects" ON custom_subjects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access own photos" ON record_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM study_records
      WHERE study_records.id = record_photos.record_id
      AND study_records.user_id = auth.uid()
    )
  );

-- 5. 为 user_id 字段创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_study_records_user_id ON study_records(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_subjects_user_id ON custom_subjects(user_id);
