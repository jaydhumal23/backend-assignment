
import { Task } from '../lib/Api';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Clock, AlertTriangle, CheckCircle2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // <--- 1. Import useAuth

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  // FIXED: Changed 'in_progress' to 'inprogress' to match your Backend Schema
  inprogress: { label: 'In Progress', icon: AlertTriangle, className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'bg-green-500/10 text-green-600 border-green-500/20' },
};

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-orange-500/10 text-orange-600' },
  high: { label: 'High', className: 'bg-red-500/10 text-red-600' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { isAdmin } = useAuth(); // <--- 2. Get Admin status
  
  // Safe fallback if status doesn't match config
  const status = statusConfig[task.status] || statusConfig.pending; 
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-border">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight truncate pr-2">{task.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={status.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
            <Badge variant="secondary" className={priority.className}>
              {priority.label}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task._id, 'pending')}>
              <Clock className="h-4 w-4 mr-2" />
              Set Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task._id, 'inprogress')}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Set In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task._id, 'completed')}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Set Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task._id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
        )}

        {/* 3. SHOW EMAIL IF ADMIN */}
        {isAdmin && task.user?.email && (
           <div className="flex items-center text-xs text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-md mb-2">
             <UserIcon className="h-3 w-3 mr-1.5" />
             <span className="font-medium truncate max-w-[200px]">{task.user.email}</span>
           </div>
        )}

        <p className="text-xs text-muted-foreground">
          Created {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
        </p>
      </CardContent>
    </Card>
  );
};

export default TaskCard;