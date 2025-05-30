"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  History, 
  Share2, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  Copy,
  Wand2,
  Zap,
  Clock,
  Wifi,
  WifiOff,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUpload } from "@/components/ui/file-upload";
import { useVirtualTryOn } from "@/hooks/use-virtual-try-on";
import { ANIMATION_VARIANTS, UI_CONFIG, ROUTES, SUCCESS_MESSAGES } from "@/lib/constants";
import { cn, copyToClipboard, formatRelativeTime } from "@/lib/utils";

export default function VirtualTryOnPage() {
  const {
    // State
    modelFile,
    avatarPrompt,
    garmentFile,
    backgroundFile,
    backgroundPrompt,
    seed,
    result,
    isLoading,
    progress,
    error,
    history,
    isOnline,
    
    // Actions
    setModelFile,
    setAvatarPrompt,
    setGarmentFile,
    setBackgroundFile,
    setBackgroundPrompt,
    setSeed,
    generateTryOn,
    cancelGeneration,
    clearError,
    downloadResult,
    retryGeneration,
    
    // Computed
    canGenerate,
    hasRequiredInputs,
  } = useVirtualTryOn();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Show success animation when result is generated
  useEffect(() => {
    if (result && !isLoading) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result, isLoading]);

  // ===========================================
  // Utility Functions
  // ===========================================

  const shareResult = async () => {
    if (!result) return;
    
    if (navigator.share && 'canShare' in navigator) {
      try {
        await navigator.share({
          title: 'My Virtual Try-On Result',
          text: 'Check out my virtual try-on result from StyleSync!',
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.log('Error sharing:', error);
          copyUrlToClipboard();
        }
      }
    } else {
      copyUrlToClipboard();
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await copyToClipboard(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadResult(result.url, `virtual-try-on-${result.id}.jpg`);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-4"
                variants={ANIMATION_VARIANTS.stagger}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={ANIMATION_VARIANTS.slideInLeft}>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={ROUTES.home}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                </motion.div>
                <motion.div variants={ANIMATION_VARIANTS.slideInLeft}>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Virtual Try-On Studio
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Experience fashion in a whole new way
                  </p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3"
                variants={ANIMATION_VARIANTS.stagger}
                initial="initial"
                animate="animate"
              >
                {/* Enhanced Network Status */}
                <motion.div variants={ANIMATION_VARIANTS.scaleIn}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ 
                            scale: isOnline ? [1, 1.1, 1] : 1,
                            opacity: isOnline ? [1, 0.8, 1] : 0.6
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: isOnline ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {isOnline ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                          )}
                        </motion.div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isOnline ? "Online" : "Offline"}
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Enhanced RapidAPI Badge */}
                <motion.div variants={ANIMATION_VARIANTS.scaleIn}>
                  <Badge variant="secondary" className="hidden sm:flex">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                    </motion.div>
                    RapidAPI Powered
                  </Badge>
                </motion.div>

                {/* History Toggle */}
                <motion.div variants={ANIMATION_VARIANTS.scaleIn}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className="relative"
                      >
                        <History className="w-4 h-4" />
                        {history.length > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                          >
                            {history.length}
                          </motion.span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      View History ({history.length})
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Advanced Settings Toggle */}
                <motion.div variants={ANIMATION_VARIANTS.scaleIn}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={cn(
                          "transition-colors",
                          showAdvanced && "bg-primary/10 text-primary"
                        )}
                      >
                        <motion.div
                          animate={{ rotate: showAdvanced ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Settings className="w-4 h-4" />
                        </motion.div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Advanced Settings
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Offline Warning */}
          <AnimatePresence>
            {!isOnline && (
              <motion.div
                {...ANIMATION_VARIANTS.slideDown}
                className="mb-6"
              >
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/10 text-orange-800 dark:text-orange-200">
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription>
                    You&apos;re currently offline. Please check your internet connection to use the virtual try-on feature.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                {...ANIMATION_VARIANTS.slideDown}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={retryGeneration}
                        className="h-8"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearError}
                        className="h-8"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Notification */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                {...ANIMATION_VARIANTS.slideDown}
                className="mb-6"
              >
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/10 text-green-800 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>🎉 Your virtual try-on is ready! Check out your result below.</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSuccess(false)}
                      className="h-8"
                    >
                      Dismiss
                    </Button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Input Panel */}
            <motion.div
              {...ANIMATION_VARIANTS.slideInLeft}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Wand2 className="w-5 h-5 text-primary" />
                    </motion.div>
                    Create Your Try-On
                  </CardTitle>
                  <CardDescription>
                    Upload your images or describe what you want to see
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enhanced Progress Display */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        {...ANIMATION_VARIANTS.scaleIn}
                        className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ 
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            >
                              <Loader2 className="w-4 h-4 text-primary" />
                            </motion.div>
                            <span className="text-sm font-medium">
                              RapidAPI is generating your try-on...
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="relative">
                          <Progress value={progress} className="h-2" />
                          <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                            animate={{ x: [-20, 100] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            style={{ width: "20%" }}
                          />
                        </div>
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Expected processing time: 5-10 seconds</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Our RapidAPI diffusion technology is processing your images for the perfect result
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelGeneration}
                          className="w-full"
                        >
                          Cancel Generation
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Model Input */}
                  <Tabs defaultValue="upload" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Model</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Choose how to provide the model for your try-on
                      </p>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Image</TabsTrigger>
                        <TabsTrigger value="describe">Describe</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="upload" className="space-y-2">
                      <FileUpload
                        onFileSelect={setModelFile}
                        selectedFile={modelFile}
                        label=""
                        description="Upload a clear photo of yourself or a model"
                        disabled={!!avatarPrompt.trim() || isLoading}
                        showPreview={true}
                        showMetadata={false}
                      />
                    </TabsContent>
                    
                    <TabsContent value="describe" className="space-y-2">
                      <Input
                        placeholder="e.g., Young woman with blonde hair, casual pose..."
                        value={avatarPrompt}
                        onChange={(e) => setAvatarPrompt(e.target.value)}
                        disabled={!!modelFile || isLoading}
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        Describe the model appearance for AI generation
                      </p>
                    </TabsContent>
                  </Tabs>

                  <Separator />

                  {/* Garment Input */}
                  <div>
                    <FileUpload
                      onFileSelect={setGarmentFile}
                      selectedFile={garmentFile}
                      label="Clothing Item"
                      description="Upload the garment you want to try on"
                      disabled={isLoading}
                      showPreview={true}
                      showMetadata={false}
                    />
                  </div>

                  <Separator />

                  {/* Background Input */}
                  <Tabs defaultValue="auto" className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Background (Optional)</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Customize the background for your try-on
                      </p>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="auto">Auto</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="describe">Describe</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="auto">
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        RapidAPI will automatically choose the best background
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="upload">
                      <FileUpload
                        onFileSelect={setBackgroundFile}
                        selectedFile={backgroundFile}
                        label=""
                        description="Upload a background image"
                        disabled={!!backgroundPrompt.trim() || isLoading}
                        showPreview={true}
                        showMetadata={false}
                        compactMode={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="describe">
                      <Input
                        placeholder="e.g., Modern studio, beach sunset, city street..."
                        value={backgroundPrompt}
                        onChange={(e) => setBackgroundPrompt(e.target.value)}
                        disabled={!!backgroundFile || isLoading}
                      />
                    </TabsContent>
                  </Tabs>

                  {/* Advanced Settings */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        {...ANIMATION_VARIANTS.slideDown}
                        transition={{ duration: UI_CONFIG.animation.duration.fast }}
                      >
                        <Separator />
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            <Label className="text-base font-medium">Advanced Settings</Label>
                          </div>
                          
                          <div>
                            <Label htmlFor="seed" className="text-sm font-medium">
                              Seed (Optional)
                            </Label>
                            <Input
                              id="seed"
                              placeholder="Enter a number for reproducible results"
                              value={seed}
                              onChange={(e) => setSeed(e.target.value)}
                              disabled={isLoading}
                              className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Use the same seed to reproduce similar results
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Generate Button */}
                  <motion.div 
                    className="pt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={generateTryOn}
                      disabled={!canGenerate}
                      className="w-full h-12 text-base font-medium"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ 
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <Loader2 className="w-4 h-4 mr-2" />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Try-On
                        </>
                      )}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Result Panel */}
            <motion.div
              {...ANIMATION_VARIANTS.slideInRight}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Your Result
                    </div>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-2"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={shareResult}
                            >
                              {copiedUrl ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedUrl ? "Copied!" : "Share Result"}
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleDownload}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download Image</TooltipContent>
                        </Tooltip>
                      </motion.div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <motion.div
                      {...ANIMATION_VARIANTS.scaleIn}
                      className="space-y-4"
                    >
                      {result.url ? (
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={result.url}
                            alt="Virtual try-on result"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            onError={() => {
                              // Handle broken images by clearing the result
                              console.warn('Result image failed to load');
                            }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                          <div className="text-center space-y-2">
                            <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                              Previous result is no longer available
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Generate a new try-on to see results
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Result metadata */}
                      <motion.div
                        {...ANIMATION_VARIANTS.fadeIn}
                        className="text-sm text-muted-foreground space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>Generated {formatRelativeTime(result.timestamp)}</span>
                        </div>
                        {result.processingTime && (
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            <span>Processing time: {(result.processingTime / 1000).toFixed(1)}s</span>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      {...ANIMATION_VARIANTS.fadeIn}
                      className="aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center"
                    >
                      <div className="text-center space-y-2">
                        <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          Your generated image will appear here
                        </p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
