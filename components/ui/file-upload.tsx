"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  maxSize?: number;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  selectedFile,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  label,
  description,
  disabled = false,
  className,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type. Please upload an image.");
        } else {
          setError("File upload failed. Please try again.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Simulate upload progress for better UX
        setIsUploading(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsUploading(false);
              onFileSelect(file);
              return 100;
            }
            return prev + 10;
          });
        }, 50);
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple: false,
    disabled: disabled || isUploading,
  });

  const removeFile = () => {
    onFileSelect(null);
    setError(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-destructive"
              )}
            >
              <input {...getInputProps()} />
              
              <motion.div
                animate={{ 
                  scale: isDragActive ? 1.05 : 1,
                  rotate: isDragActive ? 2 : 0 
                }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className={cn(
                    "w-6 h-6 transition-colors",
                    isDragActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum file size: {formatFileSize(maxSize)}
                  </p>
                </div>
              </motion.div>

              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-medium">Uploading...</p>
                    <Progress value={uploadProgress} className="w-32" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative border rounded-lg p-4 bg-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {selectedFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </div>
  );
} 