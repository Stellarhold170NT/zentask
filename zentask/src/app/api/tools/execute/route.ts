import { NextResponse } from 'next/server';
import { 
  moveTask, 
  updateTask, 
  splitTaskIntoSubtasks, 
  searchTasks 
} from '@/lib/actions';

export async function POST(req: Request) {
  try {
    const { toolName, args } = await req.json();

    let result;
    switch (toolName) {
      case 'move_task':
        result = await moveTask(args.taskId, args.columnId, args.orderIndex || 0);
        break;
      case 'update_task':
        result = await updateTask(args.taskId, args.updates);
        break;
      case 'split_task':
        result = await splitTaskIntoSubtasks(args.taskId, args.subtasks);
        break;
      case 'search_tasks':
        result = await searchTasks(args.projectId, args.query);
        break;
      default:
        return NextResponse.json({ error: 'Unknown tool' }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Tool execution error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
