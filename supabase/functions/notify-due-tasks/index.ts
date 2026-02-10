import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

Deno.serve(async (req) => {
    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Find tasks that are due but not notified
        // We look for tasks due in the last 10 minutes OR next 1 minute
        const now = new Date().toISOString()

        // Simplest logic: due_date <= now AND is_notified = false
        const { data: dueTasks, error: taskError } = await supabase
            .from('todos')
            .select(`
        id,
        title,
        user_id,
        user_devices (
          expo_push_token
        )
      `)
            .eq('is_notified', false)
            .eq('completed', false)
            .lte('due_date', now)
            .not('user_devices', 'is', null)

        if (taskError) throw taskError

        if (!dueTasks || dueTasks.length === 0) {
            return new Response(JSON.stringify({ message: 'No tasks due' }), { status: 200 })
        }

        const notifications = []
        const notifiedIds = []

        for (const task of dueTasks) {
            const tokens = task.user_devices
                .map((d: any) => d.expo_push_token)
                .filter(Boolean)

            for (const token of tokens) {
                notifications.push({
                    to: token,
                    sound: 'default',
                    title: 'Görev Vakti Geldi! ⏰',
                    body: `"${task.title}" görevinin süresi doldu.`,
                    data: { todoId: task.id },
                })
            }
            notifiedIds.push(task.id)
        }

        // 2. Send to Expo
        if (notifications.length > 0) {
            await fetch(EXPO_PUSH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notifications),
            })

            // 3. Mark as notified in database
            await supabase
                .from('todos')
                .update({ is_notified: true })
                .in('id', notifiedIds)
        }

        return new Response(JSON.stringify({ sent: notifications.length }), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
