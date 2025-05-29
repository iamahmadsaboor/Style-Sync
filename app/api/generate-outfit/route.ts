// app/api/generate-outfit/route.ts
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to fix the static generation error
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// You can hardcode your API key here if environment variables aren't working
const RAPID_API_KEY = process.env.RAPID_API_KEY || "c0786d7400msh99a752ecfab2236p18a844jsn19963f8b5f41";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000); // 60 seconds timeout

  try {
    // Validate API key
    if (!RAPID_API_KEY) {
      console.error("RAPID_API_KEY not configured");
      return NextResponse.json(
        { error: "API configuration error. Please configure your RapidAPI key." },
        { status: 500 }
      );
    }

    console.log("Processing virtual try-on request...");

    const formData = await req.formData();
    const modelImage = formData.get("avatar_image") as File | null;
    const avatarPrompt = formData.get("avatar_prompt") as string | null;
    const garmentImage = formData.get("clothing_image") as File | null;
    const backgroundImage = formData.get("background_image") as File | null;
    const backgroundPrompt = formData.get("background_prompt") as string | null;

    console.log("Form data received:", {
      hasModelImage: !!modelImage,
      hasAvatarPrompt: !!avatarPrompt?.trim(),
      hasGarmentImage: !!garmentImage,
      hasBackgroundImage: !!backgroundImage,
      hasBackgroundPrompt: !!backgroundPrompt?.trim()
    });

    // Input validation
    if (!modelImage && !avatarPrompt?.trim()) {
      return NextResponse.json(
        { error: "Please provide either a model image or avatar description" },
        { status: 400 }
      );
    }

    if (!garmentImage) {
      return NextResponse.json(
        { error: "Clothing image is required" },
        { status: 400 }
      );
    }

    // File validation function
    const validateFile = (file: File | null, fieldName: string) => {
      if (!file) return null;
      
      if (file.size > MAX_FILE_SIZE) {
        return `${fieldName} file is too large. Maximum size is 10MB.`;
      }
      
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `${fieldName} must be a valid image (JPEG, PNG, WebP).`;
      }
      
      return null;
    };

    const modelError = validateFile(modelImage, "Model image");
    const garmentError = validateFile(garmentImage, "Clothing image");
    const backgroundError = validateFile(backgroundImage, "Background image");

    if (modelError || garmentError || backgroundError) {
      return NextResponse.json(
        { error: modelError || garmentError || backgroundError },
        { status: 400 }
      );
    }

    // Prepare API form data
    const apiForm = new FormData();
    
    if (modelImage && !avatarPrompt?.trim()) {
      console.log("Using model image");
      apiForm.append("avatar_image", modelImage);
    } else if (avatarPrompt?.trim()) {
      console.log("Using avatar prompt:", avatarPrompt.trim());
      apiForm.append("avatar_prompt", avatarPrompt.trim());
    }
    
    console.log("Adding garment image");
    apiForm.append("clothing_image", garmentImage);
    
    if (backgroundImage && !backgroundPrompt?.trim()) {
      console.log("Using background image");
      apiForm.append("background_image", backgroundImage);
    } else if (backgroundPrompt?.trim()) {
      console.log("Using background prompt:", backgroundPrompt.trim());
      apiForm.append("background_prompt", backgroundPrompt.trim());
    }

    // Make API request
    console.log("Making request to virtual try-on API...");
    
    const response = await fetch(
      "https://try-on-diffusion.p.rapidapi.com/try-on-file",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
          "x-rapidapi-key": RAPID_API_KEY,
        },
        body: apiForm,
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    console.log("API Response status:", response.status);
    console.log("API Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = "Failed to generate virtual try-on";
      
      try {
        const errorData = await response.json();
        console.error("API Error Data:", errorData);
        errorMessage = errorData?.detail || errorData?.message || errorMessage;
      } catch {
        // If we can't parse the error response, use status text
        errorMessage = response.statusText || errorMessage;
      }

      console.error(`API Error (${response.status}):`, errorMessage);
      
      // Map common HTTP status codes to user-friendly messages
      switch (response.status) {
        case 400:
          errorMessage = "Invalid input provided. Please check your images and try again.";
          break;
        case 401:
          errorMessage = "Authentication failed. Please check your API key.";
          break;
        case 429:
          errorMessage = "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = "Service temporarily unavailable. Please try again later.";
          break;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status >= 500 ? 503 : 400 }
      );
    }

    // Check if response is actually an image
    const contentType = response.headers.get("content-type");
    console.log("Response content type:", contentType);
    
    if (!contentType?.startsWith("image/")) {
      console.error("Unexpected response type:", contentType);
      return NextResponse.json(
        { error: "Invalid response from image generation service" },
        { status: 500 }
      );
    }

    const blob = await response.blob();
    console.log("Response blob size:", blob.size);
    
    // Validate blob size
    if (blob.size === 0) {
      return NextResponse.json(
        { error: "Empty image received from service" },
        { status: 500 }
      );
    }

    console.log(`Successfully generated image: ${blob.size} bytes`);

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": blob.size.toString(),
        "Cache-Control": "no-cache", // Disable caching for development
      },
    });

  } catch (error) {
    clearTimeout(timeout);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log("Request was aborted");
        return NextResponse.json(
          { error: "Request timeout. Please try again." },
          { status: 408 }
        );
      }
      
      console.error("API route error:", error.message);
      console.error("Stack trace:", error.stack);
      
      return NextResponse.json(
        { error: "An unexpected error occurred. Please try again." },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
