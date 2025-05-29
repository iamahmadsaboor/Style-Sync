"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
}

export function Loading({ 
  size = "md", 
  text, 
  className,
  variant = "spinner" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full bg-primary",
              size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        {text && (
          <span className="ml-3 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <motion.div
          className={cn(
            "rounded-full bg-primary/20 flex items-center justify-center",
            size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : "w-16 h-16"
          )}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Sparkles className={cn("text-primary", sizeClasses[size])} />
        </motion.div>
        {text && (
          <span className="ml-3 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="flex space-x-4">
          <div className="rounded-full bg-muted h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <span className="ml-3 text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Loading StyleSync</h3>
          <p className="text-sm text-muted-foreground">
            Preparing your virtual try-on experience...
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoadingOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <Loading size="lg" text="Processing..." variant="pulse" />
    </motion.div>
  );
} 