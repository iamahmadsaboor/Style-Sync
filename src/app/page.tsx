"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [avatarPrompt, setAvatarPrompt] = useState<string>("");
  const [backgroundPrompt, setBackgroundPrompt] = useState<string>("");
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const generateTryOn = async () => {
    if (!modelImage && !avatarPrompt) {
      setError("Please upload a model image or enter an avatar description.");
      return;
    }
    if (!garmentImage) {
      setError("Please upload a clothing image.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (modelImage && !avatarPrompt) {
        formData.append("avatar_image", modelImage);
      } else if (!modelImage && avatarPrompt.trim() !== "") {
        formData.append("avatar_prompt", avatarPrompt);
      }

      if (garmentImage) {
        formData.append("clothing_image", garmentImage);
      }

      if (backgroundImage && !backgroundPrompt) {
        formData.append("background_image", backgroundImage);
      } else if (!backgroundImage && backgroundPrompt.trim() !== "") {
        formData.append("background_prompt", backgroundPrompt);
      }

      const response = await fetch("/api/generate-outfit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate try-on image.");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setTryOnResult(imageUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageSrc: string) => {
    setFullscreenImage(imageSrc);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const downloadImage = (imageSrc: string, filename: string) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Virtual Try-On
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6 bg-white shadow-lg rounded-lg p-6 border">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Model Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setModelImage(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded mt-1"
              disabled={avatarPrompt.trim() !== ""}
            />
            {avatarPrompt.trim() !== "" && (
              <p className="text-xs text-red-500 mt-1">
                Image upload disabled because avatar description is provided.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Avatar Description
            </label>
            <input
              type="text"
              value={avatarPrompt}
              onChange={(e) => setAvatarPrompt(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Describe avatar (e.g., blonde girl)"
              disabled={modelImage !== null}
            />
            {modelImage !== null && (
              <p className="text-xs text-red-500 mt-1">
                Text input disabled because a model image is uploaded.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Clothing Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGarmentImage(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Background Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBackgroundImage(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded mt-1"
              disabled={backgroundPrompt.trim() !== ""}
            />
            {backgroundPrompt.trim() !== "" && (
              <p className="text-xs text-red-500 mt-1">
                Image upload disabled because background description is
                provided.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Background Description
            </label>
            <input
              type="text"
              value={backgroundPrompt}
              onChange={(e) => setBackgroundPrompt(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Describe background (e.g., beach)"
              disabled={backgroundImage !== null}
            />
            {backgroundImage !== null && (
              <p className="text-xs text-red-500 mt-1">
                Text input disabled because a background image is uploaded.
              </p>
            )}
          </div>

          <button
            onClick={generateTryOn}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition-all duration-200 disabled:bg-gray-300"
          >
            {loading ? "Generating Try-On..." : "Generate Try-On"}
          </button>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md">
              {error}
            </div>
          )}
          {tryOnResult && (
            <div className="border-2 p-4 rounded-lg bg-white shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Try-On Result</h2>
              <div className="flex space-x-4">
                {[modelImage, garmentImage, tryOnResult].map(
                  (image, index) =>
                    image && (
                      <div key={index} className="text-center">
                        <Image
                          src={
                            typeof image === "string"
                              ? image
                              : URL.createObjectURL(image)
                          }
                          alt={`Image ${index}`}
                          width={index === 2 ? 400 : 100}
                          height={index === 2 ? 600 : 150}
                          className="rounded-lg border cursor-pointer"
                          onClick={() =>
                            handleImageClick(
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            )
                          }
                        />
                        <button
                          className="text-xs text-blue-600 mt-2 underline"
                          onClick={() =>
                            downloadImage(image, `image_${index}.jpg`)
                          }
                        >
                          Download
                        </button>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
          onClick={closeFullscreen}
        >
          <img src={fullscreenImage} className="max-w-full max-h-full" />
        </div>
      )}
    </main>
  );
}
