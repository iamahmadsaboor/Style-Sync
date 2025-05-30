// ===========================================
// Application Constants
// ===========================================

export const APP_CONFIG = {
  name: "StyleSync",
  description: "AI-Powered Virtual Try-On Platform",
  version: "1.0.0",
  author: "StyleSync Team",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://stylesync.vercel.app",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@stylesync.com",
} as const;

// ===========================================
// API Configuration
// ===========================================

export const API_CONFIG = {
  rapidApi: {
    host: "try-on-diffusion.p.rapidapi.com",
    endpoint: "https://try-on-diffusion.p.rapidapi.com/try-on-file",
    urlEndpoint: "https://try-on-diffusion.p.rapidapi.com/try-on-url",
    timeout: 60000, // 60 seconds
  },
  rateLimit: {
    requests: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_REQUESTS || "100"),
    window: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW || "60000"),
  },
} as const;

// ===========================================
// File Upload Constraints
// ===========================================

export const FILE_CONSTRAINTS = {
  maxSize: 12 * 1024 * 1024, // 12MB (API limit)
  minSize: 1024, // 1KB
  allowedTypes: [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "image/webp",
    "image/avif",
  ],
  minDimensions: {
    width: 256,
    height: 256,
  },
  recommendedDimensions: {
    width: 768,
    height: 1024,
  },
  maxDimensions: {
    width: 4096,
    height: 4096,
  },
} as const;

// ===========================================
// UI Constants
// ===========================================

export const UI_CONFIG = {
  animation: {
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
    },
    easing: {
      default: [0.4, 0.0, 0.2, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
      sharp: [0.4, 0.0, 1, 1],
    },
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  maxHistory: 10,
  debounceMs: 300,
  throttleMs: 1000,
} as const;

// ===========================================
// Error Messages
// ===========================================

export const ERROR_MESSAGES = {
  // File validation errors
  FILE_TOO_LARGE: "File too large. Maximum size is 12MB.",
  FILE_INVALID_TYPE: "Invalid file type. Please upload a JPEG, PNG, or WebP image.",
  FILE_TOO_SMALL: "File too small. Minimum size is 1KB.",
  IMAGE_DIMENSIONS_TOO_SMALL: "Image too small. Minimum dimensions are 256x256 pixels.",
  IMAGE_DIMENSIONS_TOO_LARGE: "Image too large. Maximum dimensions are 4096x4096 pixels.",
  
  // Input validation errors
  MODEL_REQUIRED: "Please provide either a model image or avatar description.",
  CLOTHING_REQUIRED: "Please upload a clothing image.",
  INVALID_PROMPT: "Please provide a valid description.",
  
  // API errors
  API_ERROR: "Failed to generate virtual try-on. Please try again.",
  API_TIMEOUT: "Request timeout. Please try again later.",
  API_RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  API_INVALID_RESPONSE: "Invalid response from image generation service.",
  API_EMPTY_RESPONSE: "Empty image received from service.",
  
  // Network errors
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  OFFLINE: "You appear to be offline. Please check your connection.",
  
  // Authentication errors
  AUTH_REQUIRED: "Authentication required. Please sign in.",
  AUTH_INVALID: "Invalid authentication. Please sign in again.",
  
  // Generic errors
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  INTERNAL_ERROR: "Internal server error. Please try again later.",
} as const;

// ===========================================
// Success Messages
// ===========================================

export const SUCCESS_MESSAGES = {
  GENERATION_COMPLETE: "Virtual try-on generated successfully!",
  FILE_UPLOADED: "File uploaded successfully.",
  COPIED_TO_CLIPBOARD: "Copied to clipboard!",
  DOWNLOAD_STARTED: "Download started.",
  SETTINGS_SAVED: "Settings saved successfully.",
} as const;

// ===========================================
// Navigation & Routes
// ===========================================

export const ROUTES = {
  home: "/",
  generate: "/generate-outfit",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

// ===========================================
// Feature Flags
// ===========================================

export const FEATURES = {
  enableImageCompression: true,
  enableOfflineMode: false,
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableErrorReporting: process.env.NODE_ENV === 'production',
  enableServiceWorker: false,
  maxHistoryItems: 10,
  autoSaveHistory: true,
} as const;

// ===========================================
// Social Links
// ===========================================

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/stylesync",
  instagram: "https://instagram.com/stylesync",
  linkedin: "https://linkedin.com/company/stylesync",
  github: "https://github.com/stylesync",
} as const;

// ===========================================
// SEO Configuration
// ===========================================

export const SEO_CONFIG = {
  title: "StyleSync | AI-Powered Virtual Try-On Platform",
  description: "Experience clothes before you buy them with our cutting-edge AI virtual try-on technology. Upload your photo and see how any outfit looks on you instantly.",
  keywords: [
    "virtual try-on",
    "AI fashion",
    "clothing visualization",
    "fashion technology",
    "style sync",
    "virtual fitting",
    "fashion AI",
    "outfit preview",
  ],
  openGraph: {
    title: "StyleSync | Virtual Try-On Platform",
    description: "Experience clothes before you buy them with AI-powered virtual fitting.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StyleSync Virtual Try-On Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@stylesync",
    creator: "@stylesync",
  },
} as const;

// ===========================================
// Animation Variants (Framer Motion)
// ===========================================

export const ANIMATION_VARIANTS = {
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { 
      duration: 0.6, 
      type: "spring",
      damping: 15,
      stiffness: 300
    }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
} as const; 