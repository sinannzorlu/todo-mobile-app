-- Add is_notified column to todos table
ALTER TABLE todos ADD COLUMN IF NOT EXISTS is_notified BOOLEAN DEFAULT FALSE;

-- Optional: Index for faster lookups of due tasks
CREATE INDEX IF NOT EXISTS idx_todos_due_notified ON todos (due_date, is_notified) WHERE is_notified = FALSE;
CREATE INDEX IF NOT EXISTS idx_todos_reminder_notified ON todos (reminder, is_notified) WHERE is_notified = FALSE;
