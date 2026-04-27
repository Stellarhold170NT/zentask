import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnmjsdbzzhhdymjutsuv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpzZGJ6emhoZHltanV0c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDA3MjMsImV4cCI6MjA5Mjg3NjcyM30.XoM34-1q4HxLX07ckn6xyTrQV0a8I729J2l2Od2DGVQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSearch() {
  console.log('--- TESTING SEARCH MODULE ---');
  const projectId = "00000000-0000-0000-0000-000000000000";
  const query = "Khởi tạo";

  const { data, error } = await supabase
    .from('tasks')
    .select('*, columns(title)')
    .eq('project_id', projectId)
    .ilike('title', `%${query}%`);

  if (error) {
    console.error('Search Error:', error.message);
  } else {
    console.log('Results Found:', data.length);
    data.forEach(t => console.log(`- [${t.id}] ${t.title} (Status: ${t.columns?.title})`));
  }
}

testSearch();
