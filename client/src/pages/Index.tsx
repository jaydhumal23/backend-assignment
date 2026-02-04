import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">TaskFlow</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Task Management System with Role-Based Access Control
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/register">Register</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Demo Admin: admin@taskflow.com / admin123
        </p>
      </div>
    </div>
  );
};

export default Index;
