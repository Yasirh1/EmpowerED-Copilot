import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Filter,
  FileText,
  ExternalLink,
  Sparkles
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

interface Citation {
  materialId: string;
  materialTitle: string;
  page?: number;
  excerpt: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI study companion. I can help you find information from your uploaded materials, answer questions about your notes, and assist with your studies. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response with citations
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on your uploaded materials, I found relevant information about "${inputValue}". Here's what I discovered from your notes:

The concept you're asking about is covered in several of your documents. According to your physics materials, this topic relates to fundamental principles that are well-documented in your course materials.

Would you like me to elaborate on any specific aspect of this topic?`,
        timestamp: new Date(),
        citations: [
          {
            materialId: "1",
            materialTitle: "Introduction to Quantum Physics",
            page: 42,
            excerpt: "The fundamental principles of quantum mechanics establish that..."
          },
          {
            materialId: "2",
            materialTitle: "Physics 301 Lecture Notes",
            page: 15,
            excerpt: "Key concepts include wave-particle duality and uncertainty..."
          }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const materials = [
    { id: "1", title: "Introduction to Quantum Physics", course: "Physics 301" },
    { id: "2", title: "Organic Chemistry Reactions", course: "Chemistry 201" },
    { id: "3", title: "Calculus III - Vector Fields", course: "Mathematics 203" },
    { id: "4", title: "Neural Networks Fundamentals", course: "Computer Science 401" },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Sidebar - Materials Filter */}
      <Card className="w-80 border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Materials
          </CardTitle>
          <CardDescription>
            Select which materials to search through
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedFilter("all")}
            >
              <FileText className="h-4 w-4 mr-2" />
              All Materials ({materials.length})
            </Button>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">By Course</h4>
              {materials.map((material) => (
                <Button
                  key={material.id}
                  variant={selectedFilter === material.id ? "default" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => setSelectedFilter(material.id)}
                >
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <div className="text-left overflow-hidden">
                    <div className="truncate">{material.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {material.course}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Ask Your Notes
            </CardTitle>
            <CardDescription>
              Chat with your course materials using AI - ask questions and get cited answers
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-academic-blue flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Citations */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-medium mb-2 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Sources:
                            </p>
                            <div className="space-y-2">
                              {message.citations.map((citation, index) => (
                                <div
                                  key={index}
                                  className="bg-background/50 rounded p-2 text-xs border"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{citation.materialTitle}</span>
                                    <div className="flex items-center gap-1">
                                      {citation.page && (
                                        <Badge variant="outline" className="text-xs">
                                          Page {citation.page}
                                        </Badge>
                                      )}
                                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-muted-foreground italic">
                                    "{citation.excerpt}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-academic-blue flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about your materials..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-primary to-academic-blue"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                <span>AI will search through {selectedFilter === "all" ? "all" : "selected"} materials and provide cited answers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}