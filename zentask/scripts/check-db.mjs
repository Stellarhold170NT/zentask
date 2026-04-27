import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnmjsdbzzhhdymjutsuv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpzZGJ6emhoZHltanV0c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDA3MjMsImV4cCI6MjA5Mjg3NjcyM30.XoM34-1q4HxLX07ckn6xyTrQV0a8I729J2l2Od2DGVQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  console.log('Checking Supabase connection...')
  
  const { data: projects, error: pError } = await supabase.from('projects').select('*')
  if (pError) {
    console.error('Error fetching projects:', pError.message)
    console.log('Maybe tables are not created yet? Please run the SQL from llm-wiki/wiki/engineering/zentask-database-schema.md in Supabase SQL Editor.')
  } else {
    console.log('Projects found:', projects)
  }
}

check()
