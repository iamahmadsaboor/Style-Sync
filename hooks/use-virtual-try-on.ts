"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ROUTES, ERROR_MESSAGES, UI_CONFIG, FEATURES } from "@/lib/constants";
import { sanitizeError, debounce, compressImage } from "@/lib/utils";
import { clientApi } from "@/lib/client-api";

// ===========================================
// Types
// ===========================================

export interface TryOnResult {
  id: string;
  url: string;
  timestamp: number;
  model: string;
  garment: string;
  background?: string;
  seed?: string;
  processingTime?: number;
  metadata?: {
    fileSize: number;
    dimensions?: { width: number; height: number };
  };
}

export interface TryOnState {
  modelFile: File | null;
  avatarPrompt: string;
  garmentFile: File | null;
  backgroundFile: File | null;
  backgroundPrompt: string;
  seed: string;
  result: TryOnResult | null;
  isLoading: boolean;
  progress: number;
  error: string | null;
  history: TryOnResult[];
  isOnline: boolean;
}

export interface TryOnOptions {
  enableCompression?: boolean;
  compressionQuality?: number;
  maxWidth?: number;
}

// ===========================================
// Storage Utilities
// ===========================================

const STORAGE_KEY = 'stylesync_tryon_history';

function saveHistoryToStorage(history: TryOnResult[]) {
  try {
    if (typeof window !== 'undefined') {
      // Filter out blob URLs as they don't persist across sessions
      const sanitizedHistory = history.map(item => ({
        ...item,
        url: item.url.startsWith('blob:') ? '' : item.url, // Clear blob URLs
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedHistory));
    }
  } catch (error) {
    console.warn('Failed to save history to localStorage:', error);
  }
}

function loadHistoryFromStorage(): TryOnResult[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out items with empty URLs (blob URLs that became invalid)
          return parsed.filter(item => item.url && !item.url.startsWith('blob:'));
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load history from localStorage:', error);
  }
  return [];
}

// ===========================================
// Hook Implementation
// ===========================================

export function useVirtualTryOn(options: TryOnOptions = {}) {
  const {
    enableCompression = FEATURES.enableImageCompression,
    compressionQuality = 0.8,
    maxWidth = 1920,
  } = options;

  // ===========================================
  // State Management
  // ===========================================

  const [state, setState] = useState<TryOnState>(() => ({
    modelFile: null,
    avatarPrompt: "",
    garmentFile: null,
    backgroundFile: null,
    backgroundPrompt: "",
    seed: "",
    result: null,
    isLoading: false,
    progress: 0,
    error: null,
    history: loadHistoryFromStorage(),
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  }));

  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ===========================================
  // Network Status Detection
  // ===========================================

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ===========================================
  // History Management
  // ===========================================

  useEffect(() => {
    saveHistoryToStorage(state.history);
  }, [state.history]);

  // ===========================================
  // State Update Utilities
  // ===========================================

  const updateState = useCallback((updates: Partial<TryOnState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // ===========================================
  // File Processing
  // ===========================================

  const processFile = useCallback(async (file: File): Promise<File> => {
    if (!enableCompression) return file;

    try {
      // Only compress if file is larger than 1MB
      if (file.size > 1024 * 1024) {
        return await compressImage(file, compressionQuality, maxWidth);
      }
      return file;
    } catch (error) {
      console.warn('File compression failed, using original:', error);
      return file;
    }
  }, [enableCompression, compressionQuality, maxWidth]);

  // ===========================================
  // Input Setters with Validation
  // ===========================================

  const setModelFile = useCallback(async (file: File | null) => {
    clearError();
    
    if (file) {
      try {
        const processedFile = await processFile(file);
        updateState({ 
          modelFile: processedFile,
          avatarPrompt: "", // Clear prompt when file is selected
        });
      } catch (error) {
        updateState({ 
          error: sanitizeError(error),
          modelFile: null,
        });
      }
    } else {
      updateState({ modelFile: null });
    }
  }, [processFile, updateState, clearError]);

  const setAvatarPrompt = useCallback(
    debounce((prompt: string) => {
      updateState({ 
        avatarPrompt: prompt,
        modelFile: prompt.trim() ? null : state.modelFile, // Clear file when prompt is entered
        error: null,
      });
    }, UI_CONFIG.debounceMs),
    [state.modelFile, updateState]
  );

  const setGarmentFile = useCallback(async (file: File | null) => {
    clearError();
    
    if (file) {
      try {
        const processedFile = await processFile(file);
        updateState({ garmentFile: processedFile });
      } catch (error) {
        updateState({ 
          error: sanitizeError(error),
          garmentFile: null,
        });
      }
    } else {
      updateState({ garmentFile: null });
    }
  }, [processFile, updateState, clearError]);

  const setBackgroundFile = useCallback(async (file: File | null) => {
    clearError();
    
    if (file) {
      try {
        const processedFile = await processFile(file);
        updateState({ 
          backgroundFile: processedFile,
          backgroundPrompt: "", // Clear prompt when file is selected
        });
      } catch (error) {
        updateState({ 
          error: sanitizeError(error),
          backgroundFile: null,
        });
      }
    } else {
      updateState({ backgroundFile: null });
    }
  }, [processFile, updateState, clearError]);

  const setBackgroundPrompt = useCallback(
    debounce((prompt: string) => {
      updateState({ 
        backgroundPrompt: prompt,
        backgroundFile: prompt.trim() ? null : state.backgroundFile, // Clear file when prompt is entered
        error: null,
      });
    }, UI_CONFIG.debounceMs),
    [state.backgroundFile, updateState]
  );

  const setSeed = useCallback((seed: string) => {
    updateState({ seed, error: null });
  }, [updateState]);

  // ===========================================
  // Validation
  // ===========================================

  const validateInputs = useCallback(() => {
    if (!state.isOnline) {
      return ERROR_MESSAGES.OFFLINE;
    }

    if (!state.modelFile && !state.avatarPrompt.trim()) {
      return ERROR_MESSAGES.MODEL_REQUIRED;
    }

    if (!state.garmentFile) {
      return ERROR_MESSAGES.CLOTHING_REQUIRED;
    }

    return null;
  }, [state.modelFile, state.avatarPrompt, state.garmentFile, state.isOnline]);

  // ===========================================
  // Progress Simulation
  // ===========================================

  const startProgressSimulation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 10 + 2, 85)
      }));
    }, 800);
  }, []);

  const stopProgressSimulation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // ===========================================
  // Generation Function
  // ===========================================

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
    const startTime = Date.now();
    
    updateState({ 
      isLoading: true, 
      error: null, 
      progress: 0 
    });

    startProgressSimulation();

    try {
      // Use the new client-side API service
      const response = await clientApi.generateTryOn({
        modelFile: state.modelFile,
        avatarPrompt: state.avatarPrompt,
        garmentFile: state.garmentFile,
        backgroundFile: state.backgroundFile,
        backgroundPrompt: state.backgroundPrompt,
        seed: state.seed,
      }, abortControllerRef.current.signal);

      if (!response.success) {
        throw new Error(response.error || ERROR_MESSAGES.API_ERROR);
      }

      if (!response.data) {
        throw new Error(ERROR_MESSAGES.API_EMPTY_RESPONSE);
      }

      const url = URL.createObjectURL(response.data);
      const processingTime = Date.now() - startTime;
      
      const result: TryOnResult = {
        id: crypto.randomUUID(),
        url,
        timestamp: Date.now(),
        model: state.modelFile?.name || state.avatarPrompt.substring(0, 50),
        garment: state.garmentFile!.name,
        background: state.backgroundFile?.name || state.backgroundPrompt || undefined,
        seed: response.seed || state.seed || undefined,
        processingTime,
        metadata: {
          fileSize: response.data.size,
        },
      };

      updateState({ 
        result,
        progress: 100,
        history: [result, ...state.history].slice(0, UI_CONFIG.maxHistory),
      });

      // Clean up old blob URLs to prevent memory leaks
      const oldHistory = state.history.slice(UI_CONFIG.maxHistory);
      oldHistory.forEach(item => {
        if (item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't show error
        return;
      }
      
      console.error("Virtual try-on error:", error);
      updateState({ 
        error: sanitizeError(error),
      });
    } finally {
      stopProgressSimulation();
      updateState({ 
        isLoading: false,
        progress: 0,
      });
      abortControllerRef.current = null;
    }
  }, [state, validateInputs, updateState, startProgressSimulation, stopProgressSimulation]);

  // ===========================================
  // Utility Functions
  // ===========================================

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopProgressSimulation();
    updateState({ isLoading: false, progress: 0 });
  }, [updateState, stopProgressSimulation]);

  const clearResult = useCallback(() => {
    if (state.result?.url.startsWith('blob:')) {
      URL.revokeObjectURL(state.result.url);
    }
    updateState({ result: null });
  }, [state.result, updateState]);

  const clearHistory = useCallback(() => {
    // Clean up blob URLs
    state.history.forEach(item => {
      if (item.url.startsWith('blob:')) {
        URL.revokeObjectURL(item.url);
      }
    });
    
    updateState({ history: [] });
    
    // Clear localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [state.history, updateState]);

  const downloadResult = useCallback((url: string, filename?: string) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `virtual-try-on-${Date.now()}.jpg`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      updateState({ error: "Download failed. Please try again." });
    }
  }, [updateState]);

  const retryGeneration = useCallback(() => {
    clearError();
    generateTryOn();
  }, [clearError, generateTryOn]);

  // ===========================================
  // Cleanup on Unmount
  // ===========================================

  useEffect(() => {
    return () => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Stop progress simulation
      stopProgressSimulation();
      
      // Clean up current result blob URL
      if (state.result?.url.startsWith('blob:')) {
        URL.revokeObjectURL(state.result.url);
      }
    };
  }, [state.result, stopProgressSimulation]);

  // ===========================================
  // Computed Values
  // ===========================================

  const hasRequiredInputs = (state.modelFile || state.avatarPrompt.trim()) && state.garmentFile;
  const canGenerate = !state.isLoading && hasRequiredInputs && state.isOnline;

  return {
    // State
    ...state,
    
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
    clearResult,
    clearHistory,
    downloadResult,
    retryGeneration,
    
    // Computed
    canGenerate,
    hasRequiredInputs,
  };
} 