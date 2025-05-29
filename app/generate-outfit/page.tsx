"use client";

import { motion } from "framer-motion";
import { Download, History, Share2, Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { GenerationProgress } from "@/components/ui/generation-progress";
import { useVirtualTryOn } from "@/hooks/use-virtual-try-on";
import { cn } from "@/lib/utils";

export default function VirtualTryOnPage() {
  const {
    // State
    modelFile,
    avatarPrompt,
    garmentFile,
    backgroundFile,
    backgroundPrompt,
    result,
    isLoading,
    progress,
    error,
    history,
    
    // Actions
    setModelFile,
    setAvatarPrompt,
    setGarmentFile,
    setBackgroundFile,
    setBackgroundPrompt,
    generateTryOn,
    cancelGeneration,
    clearError,
    downloadResult,
    
    // Computed
    canGenerate,
    hasRequiredInputs,
  } = useVirtualTryOn();

  const shareResult = async () => {
    if (!result) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Virtual Try-On Result',
          text: 'Check out my virtual try-on result from StyleSync!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Virtual Try-On Studio</h1>
                  <p className="text-sm text-muted-foreground">
                    Experience fashion in a whole new way
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Create Your Try-On
                  </CardTitle>
                  <CardDescription>
                    Upload your images or describe what you want to see
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        disabled={!!avatarPrompt.trim()}
                      />
                    </TabsContent>
                    
                    <TabsContent value="describe" className="space-y-2">
                      <Input
                        placeholder="e.g., Young woman with blonde hair, casual pose..."
                        value={avatarPrompt}
                        onChange={(e) => setAvatarPrompt(e.target.value)}
                        disabled={!!modelFile}
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
                        AI will automatically choose the best background
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="upload">
                      <FileUpload
                        onFileSelect={setBackgroundFile}
                        selectedFile={backgroundFile}
                        label=""
                        description="Upload a background image"
                        disabled={!!backgroundPrompt.trim()}
                      />
                    </TabsContent>
                    
                    <TabsContent value="describe">
                      <Input
                        placeholder="e.g., Modern studio, beach sunset, city street..."
                        value={backgroundPrompt}
                        onChange={(e) => setBackgroundPrompt(e.target.value)}
                        disabled={!!backgroundFile}
                      />
                    </TabsContent>
                  </Tabs>

                  {/* Error Display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                    >
                      {error}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearError}
                        className="ml-2 h-auto p-0 text-destructive hover:text-destructive"
                      >
                        Dismiss
                      </Button>
                    </motion.div>
                  )}

                  {/* Generate Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={generateTryOn}
                      disabled={!canGenerate}
                      size="lg"
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Virtual Try-On
                        </>
                      )}
                    </Button>
                    
                    {!hasRequiredInputs && (
                      <p className="text-xs text-muted-foreground text-center">
                        Please provide a model (image or description) and clothing item
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Result Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Virtual Try-On</CardTitle>
                      <CardDescription>
                        See how the outfit looks on you
                      </CardDescription>
                    </div>
                    {result && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadResult(result.url)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={shareResult}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={result.url}
                          alt="Virtual try-on result"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-muted-foreground">Model</Label>
                          <p className="font-medium truncate">{result.model}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Garment</Label>
                          <p className="font-medium truncate">{result.garment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                      <div className="text-center space-y-2">
                        <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          Your virtual try-on will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* History */}
              {history.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Recent Try-Ons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {history.slice(0, 6).map((item, index) => (
                        <motion.div
                          key={item.timestamp}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => downloadResult(item.url, `history-${item.timestamp}.jpg`)}
                        >
                          <Image
                            src={item.url}
                            alt={`Try-on ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Generation Progress Overlay */}
      <GenerationProgress
        isLoading={isLoading}
        progress={progress}
        onCancel={cancelGeneration}
      />
    </>
  );
}
