import { Moon, Calendar, MessageCircle, Target, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Moon },
    { path: '/checkin', label: 'Check In', icon: Calendar },
    { path: '/questions', label: 'Questions', icon: MessageCircle },
    { path: '/suggestions', label: 'Suggestions', icon: Target },
    { path: '/progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 md:relative md:bg-transparent md:border-0 md:backdrop-blur-none">
      <div className="flex justify-center md:justify-start">
        <div className="flex space-x-1 p-2 md:space-x-4 md:p-4">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-300 min-w-[60px] md:min-w-0",
                  isActive
                    ? "bg-gradient-sleep text-white shadow-sleep"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;