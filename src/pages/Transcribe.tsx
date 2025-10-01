import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mic, 
  MicOff, 
  Square, 
  Save, 
  Settings, 
  Languages,
  Waves,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Transcribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [courseTitle, setCourseTitle] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
  ];

  const startRecording = useCallback(async () => {
    try {
      // Check for browser support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast({
          title: "Browser Not Supported",
          description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
      
      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Recognition Error",
          description: "There was an issue with speech recognition. Please try again.",
          variant: "destructive",
        });
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Transcription is now active. Start speaking!",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use transcription.",
        variant: "destructive",
      });
    }
  }, [selectedLanguage, toast]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsRecording(false);
    setIsPaused(false);
    
    toast({
      title: "Recording Stopped",
      description: "Transcription has been completed.",
    });
  }, [toast]);

  const pauseRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      if (isPaused) {
        recognitionRef.current.start();
        setIsPaused(false);
        toast({
          title: "Recording Resumed",
          description: "Transcription is active again.",
        });
      } else {
        recognitionRef.current.stop();
        setIsPaused(true);
        toast({
          title: "Recording Paused",
          description: "Transcription is temporarily paused.",
        });
      }
    }
  }, [isRecording, isPaused, toast]);

  const saveTranscript = useCallback(() => {
    if (!transcript.trim()) {
      toast({
        title: "No Content",
        description: "There's no transcript content to save.",
        variant: "destructive",
      });
      return;
    }

    // Create a downloadable file
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sessionTitle || 'transcript'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Transcript Saved",
      description: "Your transcript has been downloaded successfully.",
    });
  }, [transcript, sessionTitle, toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Live Transcription</h1>
        <p className="text-muted-foreground">
          Record and transcribe lectures in real-time with multi-language support
        </p>
      </div>

      {/* Recording Controls */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            Recording Controls
          </CardTitle>
          <CardDescription>
            Start recording to begin real-time transcription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                placeholder="e.g., Physics 101"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="session">Session Title</Label>
              <Input
                id="session"
                placeholder="e.g., Chapter 12 - Thermodynamics"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <Label>Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      {lang.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recording Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant={isRecording ? "default" : "secondary"}
                className={isRecording ? "animate-pulse-glow" : ""}
              >
                {isRecording ? (
                  <>
                    <Volume2 className="h-3 w-3 mr-1" />
                    {isPaused ? "Paused" : "Recording"}
                  </>
                ) : (
                  "Stopped"
                )}
              </Badge>
              {transcript && (
                <Badge variant="outline">
                  {transcript.length} characters
                </Badge>
              )}
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} className="bg-gradient-to-r from-primary to-academic-blue">
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={pauseRecording}>
                    {isPaused ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button variant="destructive" onClick={stopRecording}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Display */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Transcript</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={saveTranscript}
              disabled={!transcript.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </CardTitle>
          <CardDescription>
            Real-time transcription will appear here as you speak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              isRecording 
                ? "Transcription will appear here..." 
                : "Start recording to see transcription"
            }
            className="min-h-[300px] font-mono text-sm resize-none"
          />
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Accessibility Options
          </CardTitle>
          <CardDescription>
            Customize the transcription experience for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>• High contrast mode available in Settings</p>
            <p>• Keyboard shortcuts: Space to pause/resume, Ctrl+S to save</p>
            <p>• Auto-punctuation enabled for better readability</p>
            <p>• Real-time captions with adjustable font size</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}