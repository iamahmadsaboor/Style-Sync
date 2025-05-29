"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles, Shirt, User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface GenerationProgressProps {
  isLoading: boolean;
  progress: number;
  onCancel?: () => void;
  className?: string;
}

const stages = [
  {
    icon: User,
    label: "Processing Model",
    description: "Analyzing your model image",
    minProgress: 0,
    maxProgress: 25,
  },
  {
    icon: Shirt,
    label: "Processing Garment",
    description: "Understanding the clothing item",
    minProgress: 25,
    maxProgress: 50,
  },
  {
    icon: Sparkles,
    label: "AI Magic",
    description: "Creating the virtual try-on",
    minProgress: 50,
    maxProgress: 85,
  },
  {
    icon: Camera,
    label: "Finalizing",
    description: "Generating final image",
    minProgress: 85,
    maxProgress: 100,
  },
];

export function GenerationProgress({
  isLoading,
  progress,
  onCancel,
  className,
}: GenerationProgressProps) {
  const currentStageIndex = stages.findIndex(
    stage => progress >= stage.minProgress && progress < stage.maxProgress
  );
  
  const activeStage = currentStageIndex >= 0 ? currentStageIndex : stages.length - 1;

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",
          className
        )}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-card border rounded-lg shadow-lg p-8 w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold">Generating Virtual Try-On</h3>
            <p className="text-sm text-muted-foreground">
              Our AI is creating your perfect fit
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(progress)}%</span>
              <span>~30 seconds</span>
            </div>
          </div>

          {/* Stages */}
          <div className="space-y-4 mb-6">
            {stages.map((stage, index) => {
              const isActive = index === activeStage;
              const isCompleted = index < activeStage || progress >= stage.maxProgress;
              const Icon = stage.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                    isActive && "bg-primary/5 border border-primary/20",
                    isCompleted && !isActive && "opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "font-medium text-sm",
                        isActive && "text-primary",
                        isCompleted && !isActive && "text-muted-foreground"
                      )}
                    >
                      {stage.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel Generation
              </Button>
            </div>
          )}

          {/* Fun facts while waiting */}
          <motion.div
            key={Math.floor(progress / 20)} // Change every 20% progress
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-3 bg-muted/50 rounded-lg text-center"
          >
            <p className="text-xs text-muted-foreground">
              {progress < 20 && "💡 Tip: Better lighting in your photos leads to better results!"}
              {progress >= 20 && progress < 40 && "🎨 Our AI analyzes millions of fashion combinations"}
              {progress >= 40 && progress < 60 && "✨ Creating photorealistic virtual fitting"}
              {progress >= 60 && progress < 80 && "🔮 Adding final touches and adjustments"}
              {progress >= 80 && "🎉 Almost ready! Preparing your stunning result"}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 