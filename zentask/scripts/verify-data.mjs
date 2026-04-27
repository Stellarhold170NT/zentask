import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnmjsdbzzhhdymjutsuv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpzZGJ6emhoZHltanV0c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDA3MjMsImV4cCI6MjA5Mjg3NjcyM30.XoM34-1q4HxLX07ckn6xyTrQV0a8I729J2l2Od2DGVQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  console.log('Verifying columns and tasks...')
  
  const { data: cols, error: cErr } = await supabase.from('columns').select('*')
  console.log('Columns in DB:', cols?.length || 0, cols)
  
  const { data: tasks, error: tErr } = await supabase.from('tasks').select('*')
  console.log('Tasks in DB:', tasks?.length || 0, tasks)
}

check()
