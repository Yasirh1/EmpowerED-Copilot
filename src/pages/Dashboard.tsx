import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  FileText, 
  MessageSquare, 
  Upload, 
  TrendingUp, 
  Clock,
  Brain,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Start Live Transcription",
      description: "Record and transcribe lectures in real-time",
      icon: Mic,
      action: () => navigate("/transcribe"),
      variant: "primary" as const,
      gradient: "from-primary to-academic-blue",
    },
    {
      title: "Upload Materials",
      description: "Add PDFs, slides, and documents to your library",
      icon: Upload,
      action: () => navigate("/upload"),
      variant: "secondary" as const,
      gradient: "from-success to-academic-blue",
    },
    {
      title: "Ask Your Notes",
      description: "Chat with your materials using AI",
      icon: MessageSquare,
      action: () => navigate("/chat"),
      variant: "secondary" as const,
      gradient: "from-warning to-primary",
    },
    {
      title: "Browse Library",
      description: "View and manage your course materials",
      icon: FileText,
      action: () => navigate("/materials"),
      variant: "secondary" as const,
      gradient: "from-academic-navy to-primary",
    },
  ];

  const recentActivity = [
    { title: "Physics Lecture - Chapter 12", time: "2 hours ago", type: "transcription" },
    { title: "Mathematics Notes.pdf", time: "Yesterday", type: "upload" },
    { title: "Chemistry Q&A Session", time: "2 days ago", type: "chat" },
  ];

  const stats = [
    { label: "Materials Uploaded", value: "24", icon: FileText, change: "+3 this week" },
    { label: "Hours Transcribed", value: "18.5", icon: Clock, change: "+2.5 this week" },
    { label: "AI Conversations", value: "47", icon: Brain, change: "+12 this week" },
    { label: "Study Sessions", value: "156", icon: Target, change: "+8 this week" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-academic-blue rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Student! 🎓</h1>
        <p className="text-white/90 mb-4">
          Ready to supercharge your learning today? Your AI-powered study companion is here to help.
        </p>
        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
          <TrendingUp className="w-3 h-3 mr-1" />
          Your learning streak: 7 days
        </Badge>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="group cursor-pointer transition-all duration-300 hover:shadow-elevation-md hover:-translate-y-1 border-card-border"
              onClick={action.action}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Learning Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-card-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-success font-medium">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle className="text-lg">Latest Sessions</CardTitle>
            <CardDescription>
              Your most recent learning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === "transcription" && <Mic className="h-4 w-4 text-primary" />}
                      {activity.type === "upload" && <Upload className="h-4 w-4 text-primary" />}
                      {activity.type === "chat" && <MessageSquare className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}