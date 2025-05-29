"use client";

import { useState, useCallback, useRef } from "react";

export interface TryOnResult {
  url: string;
  timestamp: number;
  model: string;
  garment: string;
  background?: string;
}

export interface TryOnState {
  modelFile: File | null;
  avatarPrompt: string;
  garmentFile: File | null;
  backgroundFile: File | null;
  backgroundPrompt: string;
  result: TryOnResult | null;
  isLoading: boolean;
  progress: number;
  error: string | null;
  history: TryOnResult[];
}

export function useVirtualTryOn() {
  const [state, setState] = useState<TryOnState>({
    modelFile: null,
    avatarPrompt: "",
    garmentFile: null,
    backgroundFile: null,
    backgroundPrompt: "",
    result: null,
    isLoading: false,
    progress: 0,
    error: null,
    history: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const updateState = useCallback((updates: Partial<TryOnState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setModelFile = useCallback((file: File | null) => {
    updateState({ 
      modelFile: file,
      avatarPrompt: file ? "" : state.avatarPrompt, // Clear prompt if file is selected
      error: null
    });
  }, [state.avatarPrompt, updateState]);

  const setAvatarPrompt = useCallback((prompt: string) => {
    updateState({ 
      avatarPrompt: prompt,
      modelFile: prompt ? null : state.modelFile, // Clear file if prompt is entered
      error: null
    });
  }, [state.modelFile, updateState]);

  const setGarmentFile = useCallback((file: File | null) => {
    updateState({ garmentFile: file, error: null });
  }, [updateState]);

  const setBackgroundFile = useCallback((file: File | null) => {
    updateState({ 
      backgroundFile: file,
      backgroundPrompt: file ? "" : state.backgroundPrompt, // Clear prompt if file is selected
      error: null
    });
  }, [state.backgroundPrompt, updateState]);

  const setBackgroundPrompt = useCallback((prompt: string) => {
    updateState({ 
      backgroundPrompt: prompt,
      backgroundFile: prompt ? null : state.backgroundFile, // Clear file if prompt is entered
      error: null
    });
  }, [state.backgroundFile, updateState]);

  const validateInputs = useCallback(() => {
    if (!state.modelFile && !state.avatarPrompt.trim()) {
      return "Please provide a model image or avatar description";
    }
    if (!state.garmentFile) {
      return "Please upload a clothing image";
    }
    return null;
  }, [state.modelFile, state.avatarPrompt, state.garmentFile]);

  const generateTryOn = useCallback(async () => {
    const validationError = validateInputs();
    if (validationError) {
      updateState({ error: validationError });
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    updateState({ 
      isLoading: true, 
      error: null, 
      progress: 0 
    });

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 15, 90)
      }));
    }, 500);

    try {
      const formData = new FormData();
      
      if (state.modelFile && !state.avatarPrompt.trim()) {
        formData.append("avatar_image", state.modelFile);
      } else if (state.avatarPrompt.trim()) {
        formData.append("avatar_prompt", state.avatarPrompt);
      }
      
      formData.append("clothing_image", state.garmentFile!);
      
      if (state.backgroundFile && !state.backgroundPrompt.trim()) {
        formData.append("background_image", state.backgroundFile);
      } else if (state.backgroundPrompt.trim()) {
        formData.append("background_prompt", state.backgroundPrompt);
      }

      const response = await fetch("/api/generate-outfit", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const result: TryOnResult = {
        url,
        timestamp: Date.now(),
        model: state.modelFile?.name || state.avatarPrompt,
        garment: state.garmentFile!.name,
        background: state.backgroundFile?.name || state.backgroundPrompt || undefined,
      };

      updateState({ 
        result,
        progress: 100,
        history: [result, ...state.history].slice(0, 10), // Keep last 10 results
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled
        return;
      }
      
      console.error("Virtual try-on error:", error);
      updateState({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
    } finally {
      clearInterval(progressInterval);
      updateState({ 
        isLoading: false,
        progress: 0,
      });
      abortControllerRef.current = null;
    }
  }, [state, validateInputs, updateState]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    updateState({ isLoading: false, progress: 0 });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const clearResult = useCallback(() => {
    updateState({ result: null });
  }, [updateState]);

  const clearHistory = useCallback(() => {
    updateState({ history: [] });
  }, [updateState]);

  const downloadResult = useCallback((url: string, filename?: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `virtual-try-on-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    setModelFile,
    setAvatarPrompt,
    setGarmentFile,
    setBackgroundFile,
    setBackgroundPrompt,
    generateTryOn,
    cancelGeneration,
    clearError,
    clearResult,
    clearHistory,
    downloadResult,
    
    // Computed
    canGenerate: !state.isLoading && validateInputs() === null,
    hasRequiredInputs: (state.modelFile || state.avatarPrompt.trim()) && state.garmentFile,
  };
} 