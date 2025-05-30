"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, AlertCircle, Check, FileImage, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FILE_CONSTRAINTS, ANIMATION_VARIANTS, UI_CONFIG } from "@/lib/constants";
import { formatFileSize, getImageDimensions } from "@/lib/utils";

// ===========================================
// Types
// ===========================================

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  maxSize?: number;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  showMetadata?: boolean;
  compactMode?: boolean;
}

interface FileMetadata {
  dimensions?: { width: number; height: number };
  size: number;
  type: string;
  lastModified: number;
}

// ===========================================
// Component Implementation
// ===========================================

export function FileUpload({
  onFileSelect,
  selectedFile,
  accept = "image/*",
  maxSize = FILE_CONSTRAINTS.maxSize,
  label,
  description,
  disabled = false,
  className,
  showPreview = true,
  showMetadata = true,
  compactMode = false,
}: FileUploadProps) {
  
  // ===========================================
  // State Management
  // ===========================================
  
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragDepth, setDragDepth] = useState(0);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ===========================================
  // File Processing
  // ===========================================

  const processFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate upload progress for better UX
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    try {
      // Get image metadata
      const fileMetadata: FileMetadata = {
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };

      if (file.type.startsWith('image/')) {
        try {
          fileMetadata.dimensions = await getImageDimensions(file);
        } catch (error) {
          console.warn('Failed to get image dimensions:', error);
        }
      }

      setMetadata(fileMetadata);

      // Create preview URL
      if (file.type.startsWith('image/') && showPreview) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }

      // Complete the progress
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          onFileSelect(file);
        }, 500);
      }, 200);

    } catch (error) {
      console.error('File processing error:', error);
      setError('Failed to process file. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }

    clearInterval(interval);
  }, [onFileSelect, showPreview]);

  // ===========================================
  // Drag & Drop Handlers
  // ===========================================

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        const errorCode = rejection.errors[0]?.code;
        
        switch (errorCode) {
          case "file-too-large":
            setError(`File too large. Maximum size is ${formatFileSize(maxSize)}.`);
            break;
          case "file-invalid-type":
            setError("Invalid file type. Please upload an image.");
            break;
          case "too-many-files":
            setError("Please upload only one file at a time.");
            break;
          default:
            setError("File upload failed. Please try again.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    [maxSize, processFile]
  );

  const onDragEnter = useCallback(() => {
    setDragDepth(prev => prev + 1);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragDepth(prev => prev - 1);
  }, []);

  // ===========================================
  // Dropzone Configuration
  // ===========================================

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: { [accept]: [] },
    maxSize,
    multiple: false,
    disabled: disabled || isUploading,
    noClick: false,
    noKeyboard: false,
  });

  // ===========================================
  // File Removal
  // ===========================================

  const removeFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setMetadata(null);
    setError(null);
    setUploadProgress(0);
    onFileSelect(null);
  }, [previewUrl, onFileSelect]);

  // ===========================================
  // Manual File Selection
  // ===========================================

  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // ===========================================
  // Cleanup Effect
  // ===========================================

  useState(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
    };
  });

  // ===========================================
  // Render Logic
  // ===========================================

  const isDragOver = isDragActive || dragDepth > 0;

  if (compactMode) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={disabled || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {selectedFile ? 'Change' : 'Upload'}
          </Button>
          
          {selectedFile && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileImage className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm truncate">{selectedFile.name}</span>
              <Badge variant="secondary" className="text-xs">
                {formatFileSize(selectedFile.size)}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="p-1 h-auto"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          {...getInputProps()}
          style={{ display: 'none' }}
        />
        
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label */}
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
            {...ANIMATION_VARIANTS.fadeIn}
            transition={{ duration: UI_CONFIG.animation.duration.fast }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                isDragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/20",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-destructive/50 bg-destructive/5"
              )}
              role="button"
              tabIndex={0}
              aria-label={`Upload ${label.toLowerCase()}`}
            >
              <input {...getInputProps()} />
              
              <motion.div
                animate={{ 
                  scale: isDragOver ? 1.05 : 1,
                  rotate: isDragOver ? 2 : 0 
                }}
                transition={{ 
                  duration: UI_CONFIG.animation.duration.fast,
                  ease: UI_CONFIG.animation.easing.default
                }}
                className="space-y-4"
              >
                <div className={cn(
                  "mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                  isDragOver 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                
                <div>
                  <p className="text-lg font-medium">
                    {isDragOver 
                      ? "Drop the file here" 
                      : isUploading 
                      ? "Processing..." 
                      : "Drag & drop your file here"
                    }
                  </p>
                  {!isUploading && (
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse files
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum file size: {formatFileSize(maxSize)}
                  </p>
                </div>
              </motion.div>

              {/* Upload Progress Overlay */}
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="text-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Uploading...</p>
                        <Progress value={uploadProgress} className="w-32" />
                        <p className="text-xs text-muted-foreground">
                          {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            {...ANIMATION_VARIANTS.scaleIn}
            transition={{ duration: UI_CONFIG.animation.duration.normal }}
            className="relative border rounded-lg p-4 bg-card"
          >
            <div className="flex items-start gap-4">
              {/* File Preview */}
              <div className="relative w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {previewUrl ? (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
                
                {/* Success Indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 15 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                  {metadata?.dimensions && (
                    <Badge variant="outline" className="text-xs">
                      {metadata.dimensions.width} × {metadata.dimensions.height}
                    </Badge>
                  )}
                </div>
                
                {showMetadata && metadata && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Type: {selectedFile.type || 'Unknown'}</p>
                    <p>Modified: {new Date(metadata.lastModified).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="p-2 h-auto text-muted-foreground hover:text-destructive"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: UI_CONFIG.animation.duration.fast }}
            className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="p-1 h-auto text-destructive hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 