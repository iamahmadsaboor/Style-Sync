import { NextRequest, NextResponse } from "next/server";

const RAPID_API_KEY = process.env.RAPID_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const modelImage = formData.get("avatar_image") as File | null;
    const garmentImage = formData.get("clothing_image") as File | null;
    const backgroundImage = formData.get("background_image") as File | null;
    const avatarPrompt = formData.get("avatar_prompt") as string | null;
    const backgroundPrompt = formData.get("background_prompt") as string | null;

    // Ensure at least a model image or avatar prompt is provided
    if (!modelImage && !avatarPrompt) {
      return NextResponse.json(
        { error: "Either a model image or an avatar description is required." },
        { status: 400 }
      );
    }
    if (!garmentImage) {
      return NextResponse.json(
        { error: "A clothing image is required." },
        { status: 400 }
      );
    }

    console.log("Uploading to Texel.Moda API...");

    const apiFormData = new FormData();

    // Conditional logic to ensure only valid combinations are sent
    if (modelImage && !avatarPrompt) {
      apiFormData.append("avatar_image", modelImage);
    } else if (!modelImage && avatarPrompt) {
      apiFormData.append("avatar_prompt", avatarPrompt);
    }

    if (garmentImage) {
      apiFormData.append("clothing_image", garmentImage);
    }

    if (backgroundImage && !backgroundPrompt) {
      apiFormData.append("background_image", backgroundImage);
    } else if (!backgroundImage && backgroundPrompt) {
      apiFormData.append("background_prompt", backgroundPrompt);
    }

    console.log("FormData Sent:", Object.fromEntries(apiFormData.entries()));

    // Use AbortController to set a longer timeout (30s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    // API Call
    const response = await fetch(
      "https://try-on-diffusion.p.rapidapi.com/try-on-file",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
          "x-rapidapi-key": RAPID_API_KEY!,
        },
        body: apiFormData,
        signal: controller.signal, // Attach timeout controller
      }
    );

    clearTimeout(timeout); // Clear timeout if request succeeds

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.detail || response.statusText}`);
    }

    const tryOnImageUrl = await response.blob();
    return new Response(tryOnImageUrl, {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
