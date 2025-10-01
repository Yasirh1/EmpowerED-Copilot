import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload as UploadIcon, 
  FileText, 
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  course?: string;
  tags?: string[];
}

export default function Upload() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [defaultCourse, setDefaultCourse] = useState("");
  const [defaultTags, setDefaultTags] = useState("");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending",
      course: defaultCourse,
      tags: defaultTags.split(",").map(tag => tag.trim()).filter(Boolean),
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);

    // Auto-start upload simulation
    newFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });
  }, [defaultCourse, defaultTags]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: true,
  });

  const simulateUpload = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          const newStatus = newProgress === 100 ? "processing" : "uploading";
          
          if (newProgress === 100) {
            clearInterval(uploadInterval);
            // Start processing simulation
            setTimeout(() => {
              setUploadFiles(prev => prev.map(f => 
                f.id === fileId ? { ...f, status: "completed" } : f
              ));
              toast({
                title: "Upload Complete",
                description: `${file.file.name} has been processed and is ready for search.`,
              });
            }, 2000);
          }
          
          return { ...file, progress: newProgress, status: newStatus };
        }
        return file;
      }));
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const updateFileMetadata = (fileId: string, course: string, tags: string[]) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, course, tags } : file
    ));
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "uploading":
        return "Uploading";
      case "processing":
        return "Processing";
      case "completed":
        return "Ready";
      case "error":
        return "Error";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Upload Materials</h1>
        <p className="text-muted-foreground">
          Add PDFs, presentations, and documents to your study library
        </p>
      </div>

      {/* Default Settings */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
          <CardDescription>
            Set default course and tags for uploaded files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default-course">Default Course</Label>
              <Input
                id="default-course"
                placeholder="e.g., Physics 301"
                value={defaultCourse}
                onChange={(e) => setDefaultCourse(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="default-tags">Default Tags (comma-separated)</Label>
              <Input
                id="default-tags"
                placeholder="e.g., lecture, notes, important"
                value={defaultTags}
                onChange={(e) => setDefaultTags(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="border-card-border">
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UploadIcon className="h-8 w-8 text-primary" />
              </div>
              {isDragActive ? (
                <div>
                  <h3 className="text-lg font-semibold">Drop files here</h3>
                  <p className="text-muted-foreground">Release to upload your materials</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">Drag & drop files here</h3>
                  <p className="text-muted-foreground mb-2">
                    or click to select files from your computer
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports: PDF, PPTX, DOCX, TXT files up to 50MB each
                  </p>
                </div>
              )}
              <Button variant="outline">
                <UploadIcon className="h-4 w-4 mr-2" />
                Select Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Upload Queue</CardTitle>
            <CardDescription>
              Track your file uploads and processing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="border rounded-lg p-4 space-y-3">
                  {/* File Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{uploadFile.file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getStatusIcon(uploadFile.status)}
                        {getStatusText(uploadFile.status)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        disabled={uploadFile.status === "uploading" || uploadFile.status === "processing"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(uploadFile.status === "uploading" || uploadFile.status === "processing") && (
                    <div className="space-y-1">
                      <Progress value={uploadFile.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {uploadFile.status === "uploading" 
                          ? `Uploading... ${Math.round(uploadFile.progress)}%`
                          : "Processing for AI search..."
                        }
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Course</Label>
                      <Input
                        className="text-sm"
                        value={uploadFile.course || ""}
                        onChange={(e) => updateFileMetadata(
                          uploadFile.id, 
                          e.target.value, 
                          uploadFile.tags || []
                        )}
                        placeholder="Enter course name"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tags</Label>
                      <div className="flex flex-wrap gap-1 min-h-[2rem] p-2 border rounded-md">
                        {uploadFile.tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {(!uploadFile.tags || uploadFile.tags.length === 0) && (
                          <span className="text-xs text-muted-foreground">No tags</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}