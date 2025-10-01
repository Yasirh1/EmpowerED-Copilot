import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Tag,
  Eye,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Material {
  id: string;
  title: string;
  type: "pdf" | "pptx" | "docx" | "txt";
  size: string;
  uploadDate: string;
  course: string;
  tags: string[];
  processed: boolean;
}

export default function Materials() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data
  const materials: Material[] = [
    {
      id: "1",
      title: "Introduction to Quantum Physics",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      course: "Physics 301",
      tags: ["quantum", "mechanics", "theory"],
      processed: true,
    },
    {
      id: "2",
      title: "Organic Chemistry Reactions",
      type: "pptx",
      size: "5.2 MB",
      uploadDate: "2024-01-14",
      course: "Chemistry 201",
      tags: ["organic", "reactions", "synthesis"],
      processed: true,
    },
    {
      id: "3",
      title: "Calculus III - Vector Fields",
      type: "pdf",
      size: "1.8 MB",
      uploadDate: "2024-01-13",
      course: "Mathematics 203",
      tags: ["calculus", "vectors", "fields"],
      processed: false,
    },
    {
      id: "4",
      title: "Neural Networks Fundamentals",
      type: "pdf",
      size: "3.1 MB",
      uploadDate: "2024-01-12",
      course: "Computer Science 401",
      tags: ["ai", "neural", "networks", "ml"],
      processed: true,
    },
  ];

  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-primary" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      pdf: "bg-red-100 text-red-800",
      pptx: "bg-orange-100 text-orange-800",
      docx: "bg-blue-100 text-blue-800",
      txt: "bg-gray-100 text-gray-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "processed" && material.processed) ||
                         (selectedFilter === "pending" && !material.processed) ||
                         material.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Materials Library</h1>
          <p className="text-muted-foreground">
            Manage and search through your course materials
          </p>
        </div>
        <Button 
          onClick={() => navigate("/upload")}
          className="bg-gradient-to-r from-primary to-academic-blue"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Materials
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-card-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials, courses, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === "processed" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("processed")}
              >
                Processed
              </Button>
              <Button
                variant={selectedFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("pending")}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="group hover:shadow-elevation-md transition-all duration-300 border-card-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(material.type)}
                  <div>
                    <CardTitle className="text-base line-clamp-2">
                      {material.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {material.course}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getTypeColor(material.type)}>
                  {material.type.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {material.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {material.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{material.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(material.uploadDate).toLocaleDateString()}
                </div>
                <span>{material.size}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant={material.processed ? "default" : "secondary"}
                  className={material.processed ? "bg-success" : ""}
                >
                  {material.processed ? "Ready for Chat" : "Processing..."}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="px-2">
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <Card className="border-card-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No materials found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Upload your first material to get started"}
            </p>
            <Button 
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-primary to-academic-blue"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Materials
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}