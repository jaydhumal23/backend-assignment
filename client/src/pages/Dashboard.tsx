import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/use-toast';
import { Task } from '../lib/Api';
import TaskCard from '../components/TaskCard';
import TaskDialog from '../components/TaskDialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  LogOut, 
  Search, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  LayoutDashboard,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Filter tasks based on search and tab
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && task.status === activeTab;
  });

  // Stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'inprogress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleCreateOrUpdate = async (data: { title: string; description?: string; status: Task['status']; priority: Task['priority'] }) => {
    if (editingTask) {
      const result = await updateTask(editingTask._id, data);
      if (result.success) {
        toast({ title: "Task updated", description: "Your task has been updated successfully." });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } else {
      const result = await createTask(data);
      if (result.success) {
        toast({ title: "Task created", description: "Your new task has been created." });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTask(id);
    if (result.success) {
      toast({ title: "Task deleted", description: "Your task has been removed." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    const result = await updateTask(id, { status });
    if (result.success) {
      toast({ title: "Status updated", description: `Task marked as ${status.replace('_', ' ')}.` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <CheckSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">TaskFlow</span>
            {isAdmin && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.name} ({user?.email})
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "You have admin access. You can view and manage all tasks." : "Here's an overview of your tasks."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <Card className="border-border/50">
          <CardHeader className="border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Your Tasks
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleNewTask}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">New Task</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "Try a different search term." : "Create your first task to get started."}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleNewTask}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
};

export default Dashboard;
