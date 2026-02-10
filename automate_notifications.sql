-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Create the reminder function
CREATE OR REPLACE FUNCTION send_due_reminders()
RETURNS void AS $$
DECLARE
    task_record RECORD;
    device_record RECORD;
    payload JSONB;
BEGIN
    -- Loop through todos that are due but not yet notified
    FOR task_record IN 
        SELECT id, title, user_id 
        FROM todos 
        WHERE due_date <= NOW() 
          AND completed = false 
          AND is_notified = false
    LOOP
        -- For each due task, find the associated device tokens
        FOR device_record IN 
            SELECT expo_push_token 
            FROM user_devices 
            WHERE user_id = task_record.user_id 
              AND is_active = true
        LOOP
            -- Construct Expo Push Notification payload
            payload := jsonb_build_array(
                jsonb_build_object(
                    'to', device_record.expo_push_token,
                    'title', 'Görev Vakti Geldi! ⏰',
                    'body', task_record.title,
                    'sound', 'default',
                    'data', jsonb_build_object('todoId', task_record.id)
                )
            );

            -- Send notification via pg_net (async HTTP POST)
            PERFORM net.http_post(
                url := 'https://exp.host/--/api/v2/push/send',
                body := payload,
                headers := '{"Content-Type": "application/json"}'::jsonb
            );
        END LOOP;

        -- Mark the task as notified so we don't send it again
        UPDATE todos SET is_notified = true WHERE id = task_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 3. Schedule the function to run every minute
-- Note: 'reminders-job' is a unique name for this schedule
SELECT cron.schedule('reminders-job', '* * * * *', 'SELECT send_due_reminders()');
