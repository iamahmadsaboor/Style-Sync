"use client";

import { API_CONFIG, FILE_CONSTRAINTS, ERROR_MESSAGES } from "./constants";
import { sanitizeError, getImageDimensions, isValidImageType, isValidImageSize } from "./utils";

// ===========================================
// Types
// ===========================================

interface ValidationError {
  field: string;
  message: string;
}

interface TryOnOptions {
  modelFile?: File | null;
  avatarPrompt?: string;
  garmentFile?: File | null;
  backgroundFile?: File | null;
  backgroundPrompt?: string;
  seed?: string;
}

interface ApiResponse {
  success: boolean;
  data?: Blob;
  error?: string;
  seed?: string;
}

// ===========================================
// Rate Limiting (Client-side)
// ===========================================

const REQUEST_STORAGE_KEY = 'stylesync_requests';

interface RequestData {
  count: number;
  resetTime: number;
}

function getStoredRequests(): RequestData {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(REQUEST_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.warn('Failed to load request data from localStorage:', error);
  }
  return { count: 0, resetTime: Date.now() + API_CONFIG.rateLimit.window };
}

function saveRequestData(data: RequestData) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('Failed to save request data to localStorage:', error);
  }
}

function checkClientRateLimit(): boolean {
  const now = Date.now();
  const windowMs = API_CONFIG.rateLimit.window;
  const maxRequests = API_CONFIG.rateLimit.requests;

  const current = getStoredRequests();
  
  if (now > current.resetTime) {
    const newData = { count: 1, resetTime: now + windowMs };
    saveRequestData(newData);
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  saveRequestData(current);
  return true;
}

// ===========================================
// Validation Functions
// ===========================================

async function validateFile(file: File | null, fieldName: string): Promise<ValidationError | null> {
  if (!file) return null;

  // Basic file validation
  if (!isValidImageType(file)) {
    return { field: fieldName, message: ERROR_MESSAGES.FILE_INVALID_TYPE };
  }

  if (!isValidImageSize(file, FILE_CONSTRAINTS.maxSize / (1024 * 1024))) {
    return { field: fieldName, message: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  if (file.size < FILE_CONSTRAINTS.minSize) {
    return { field: fieldName, message: ERROR_MESSAGES.FILE_TOO_SMALL };
  }

  // Image dimensions validation
  try {
    const dimensions = await getImageDimensions(file);
    
    if (dimensions.width < FILE_CONSTRAINTS.minDimensions.width || 
        dimensions.height < FILE_CONSTRAINTS.minDimensions.height) {
      return { field: fieldName, message: ERROR_MESSAGES.IMAGE_DIMENSIONS_TOO_SMALL };
    }

    if (dimensions.width > FILE_CONSTRAINTS.maxDimensions.width || 
        dimensions.height > FILE_CONSTRAINTS.maxDimensions.height) {
      return { field: fieldName, message: ERROR_MESSAGES.IMAGE_DIMENSIONS_TOO_LARGE };
    }
  } catch (error) {
    console.error(`Failed to get dimensions for ${fieldName}:`, error);
    // Don't fail validation for dimension check errors
  }

  return null;
}

function validatePrompt(prompt: string | null, fieldName: string): ValidationError | null {
  if (!prompt) return null;
  
  const trimmed = prompt.trim();
  if (trimmed.length === 0) return null;
  
  if (trimmed.length < 3) {
    return { field: fieldName, message: ERROR_MESSAGES.INVALID_PROMPT };
  }
  
  if (trimmed.length > 500) {
    return { field: fieldName, message: `${fieldName} description too long. Maximum 500 characters.` };
  }
  
  return null;
}

// ===========================================
// Main API Service
// ===========================================

export class ClientApiService {
  private static instance: ClientApiService;
  private rapidApiKey: string;

  private constructor() {
    // Get API key from environment variable (public)
    this.rapidApiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY || "c0786d7400msh99a752ecfab2236p18a844jsn19963f8b5f41";
  }

  public static getInstance(): ClientApiService {
    if (!ClientApiService.instance) {
      ClientApiService.instance = new ClientApiService();
    }
    return ClientApiService.instance;
  }

  async validateInputs(options: TryOnOptions): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    // Check if user is online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      errors.push({ field: 'network', message: ERROR_MESSAGES.OFFLINE });
      return errors;
    }

    // Validate model input (either file or prompt, not both)
    if (!options.modelFile && !options.avatarPrompt?.trim()) {
      errors.push({ field: 'model', message: ERROR_MESSAGES.MODEL_REQUIRED });
    }

    // Validate garment file (required)
    if (!options.garmentFile) {
      errors.push({ field: 'garment', message: ERROR_MESSAGES.CLOTHING_REQUIRED });
    }

    // Validate files
    const modelError = await validateFile(options.modelFile ?? null, 'modelFile');
    if (modelError) errors.push(modelError);

    const garmentError = await validateFile(options.garmentFile ?? null, 'garmentFile');
    if (garmentError) errors.push(garmentError);

    const backgroundError = await validateFile(options.backgroundFile ?? null, 'backgroundFile');
    if (backgroundError) errors.push(backgroundError);

    // Validate prompts
    const avatarPromptError = validatePrompt(options.avatarPrompt ?? null, 'avatarPrompt');
    if (avatarPromptError) errors.push(avatarPromptError);

    const backgroundPromptError = validatePrompt(options.backgroundPrompt ?? null, 'backgroundPrompt');
    if (backgroundPromptError) errors.push(backgroundPromptError);

    return errors;
  }

  async generateTryOn(options: TryOnOptions, abortSignal?: AbortSignal): Promise<ApiResponse> {
    try {
      // Rate limiting check
      if (!checkClientRateLimit()) {
        return {
          success: false,
          error: ERROR_MESSAGES.API_RATE_LIMIT
        };
      }

      // Validate API key
      if (!this.rapidApiKey || this.rapidApiKey === "your_rapidapi_key_here") {
        return {
          success: false,
          error: "API key not configured properly"
        };
      }

      // Validate inputs
      const validationErrors = await this.validateInputs(options);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: validationErrors.map(e => e.message).join(', ')
        };
      }

      // Prepare form data for API
      const formData = new FormData();

      // Add model input (image or prompt, not both)
      if (options.modelFile && !options.avatarPrompt?.trim()) {
        formData.append("avatar_image", options.modelFile);
      } else if (options.avatarPrompt?.trim()) {
        formData.append("avatar_prompt", options.avatarPrompt.trim());
      }

      // Add clothing image (required)
      if (options.garmentFile) {
        formData.append("clothing_image", options.garmentFile);
      }

      // Add background input (image or prompt, optional)
      if (options.backgroundFile && !options.backgroundPrompt?.trim()) {
        formData.append("background_image", options.backgroundFile);
      } else if (options.backgroundPrompt?.trim()) {
        formData.append("background_prompt", options.backgroundPrompt.trim());
      }

      // Add seed if provided
      if (options.seed?.trim()) {
        formData.append("seed", options.seed.trim());
      }

      // Make API request
      const response = await fetch(API_CONFIG.rapidApi.endpoint, {
        method: "POST",
        headers: {
          "x-rapidapi-host": API_CONFIG.rapidApi.host,
          "x-rapidapi-key": this.rapidApiKey,
        },
        body: formData,
        signal: abortSignal,
      });

      if (!response.ok) {
        let errorMessage: string = ERROR_MESSAGES.API_ERROR;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData?.detail || errorData?.message || errorMessage;
        } catch {
          // Use status-based error messages
          switch (response.status) {
            case 400:
              errorMessage = "Invalid input provided. Please check your images and try again.";
              break;
            case 401:
              errorMessage = "Authentication failed. Please check your API key.";
              break;
            case 429:
              errorMessage = ERROR_MESSAGES.API_RATE_LIMIT;
              break;
            case 500:
            case 502:
            case 503:
              errorMessage = "Service temporarily unavailable. Please try again later.";
              break;
            default:
              errorMessage = `API Error: ${response.status}`;
          }
        }

        return {
          success: false,
          error: errorMessage
        };
      }

      // Validate response content type
      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("image/")) {
        return {
          success: false,
          error: ERROR_MESSAGES.API_INVALID_RESPONSE
        };
      }

      // Get response data
      const blob = await response.blob();
      
      if (blob.size === 0) {
        return {
          success: false,
          error: ERROR_MESSAGES.API_EMPTY_RESPONSE
        };
      }

      // Get seed from response headers if available
      const seedUsed = response.headers.get("X-Seed");

      return {
        success: true,
        data: blob,
        seed: seedUsed || options.seed
      };

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: "Request cancelled"
        };
      }

      console.error("Virtual try-on API error:", error);
      return {
        success: false,
        error: sanitizeError(error)
      };
    }
  }

  async checkHealth(): Promise<{ status: string; message?: string }> {
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return { status: 'offline', message: 'No internet connection' };
      }

      if (!this.rapidApiKey || this.rapidApiKey === "your_rapidapi_key_here") {
        return { status: 'error', message: 'API key not configured' };
      }

      // Test API connectivity with a lightweight check
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`https://${API_CONFIG.rapidApi.host}`, {
        method: 'HEAD',
        headers: {
          'x-rapidapi-host': API_CONFIG.rapidApi.host,
          'x-rapidapi-key': this.rapidApiKey,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok || response.status === 404) {
        return { status: 'healthy' };
      }

      return { 
        status: 'error', 
        message: `API responded with status ${response.status}` 
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { status: 'timeout', message: 'API connection timeout' };
      }
      
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'API connection failed' 
      };
    }
  }
}

// Export singleton instance
export const clientApi = ClientApiService.getInstance(); 