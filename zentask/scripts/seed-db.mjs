import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnmjsdbzzhhdymjutsuv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubWpzZGJ6emhoZHltanV0c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDA3MjMsImV4cCI6MjA5Mjg3NjcyM30.XoM34-1q4HxLX07ckn6xyTrQV0a8I729J2l2Od2DGVQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('Seeding initial data...')

  // 1. Check for profiles
  const { data: profiles } = await supabase.from('profiles').select('id')
  
  if (!profiles || profiles.length === 0) {
    console.log('No profiles found. You need to sign in to the app first so a profile is created via trigger (if you set one up) or manually.')
    console.log('For now, I will try to create a dummy project without a profile if the DB allows (unlikely with FK).')
  }

  // I'll try to create a project. If it fails, I'll ask the user to sign in.
  const { data: project, error: pError } = await supabase
    .from('projects')
    .insert({ name: 'Dự án Zentask Mẫu', description: 'Bảng Kanban mẫu để bắt đầu' })
    .select()

  if (pError) {
    console.error('Error creating project:', pError.message)
    return
  }

  const projectId = project[0].id
  console.log('Project created:', projectId)

  // 2. Create Columns
  const { data: columns, error: cError } = await supabase
    .from('columns')
    .insert([
      { project_id: projectId, title: 'To Do', order_index: 0, wip_limit: 5 },
      { project_id: projectId, title: 'In Progress', order_index: 1, wip_limit: 3 },
      { project_id: projectId, title: 'Done', order_index: 2 }
    ])
    .select()

  if (cError) {
    console.error('Error creating columns:', cError.message)
    return
  }

  console.log('Columns created.')

  // 3. Create Tasks
  const todoCol = columns.find(c => c.title === 'To Do').id
  const progressCol = columns.find(c => c.title === 'In Progress').id

  const { error: tError } = await supabase
    .from('tasks')
    .insert([
      { project_id: projectId, column_id: todoCol, title: 'Thiết kế Landing Page', priority: 'high', order_index: 0 },
      { project_id: projectId, column_id: todoCol, title: 'Viết tài liệu API', priority: 'medium', order_index: 1 },
      { project_id: projectId, column_id: progressCol, title: 'Tích hợp Groq AI', priority: 'urgent', order_index: 0 }
    ])

  if (tError) {
    console.error('Error creating tasks:', tError.message)
    return
  }

  console.log('Tasks created. Success!')
  console.log('Vui lòng copy ID dự án này vào KanbanBoard component:', projectId)
}

seed()
