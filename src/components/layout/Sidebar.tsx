import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Mic,
  FileText,
  MessageSquare,
  Settings,
  Upload,
  Library,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Live Transcribe", href: "/transcribe", icon: Mic },
  { name: "Materials Library", href: "/materials", icon: Library },
  { name: "Ask Your Notes", href: "/chat", icon: MessageSquare },
  { name: "Upload Materials", href: "/upload", icon: Upload },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header space */}
          <div className="h-16" />

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground group-hover:text-sidebar-primary"
                    )}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-gradient-to-r from-primary/10 to-academic-blue/10 rounded-lg p-3 text-center">
              <p className="text-xs text-sidebar-foreground font-medium">
                AI-Powered Learning
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                Empowering your education
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}