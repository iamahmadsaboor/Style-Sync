"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Download, Upload, ImageIcon, Wand2 } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const [nSamples, setNSamples] = useState(1);
  const [nSteps, setNSteps] = useState(20);
  const [imageScale, setImageScale] = useState(2);
  const [seed, setSeed] = useState(-1);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [category, setCategory] = useState<string>("none");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "model" | "garment"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "model") {
          setModelImage(file);
          setModelPreview(reader.result as string);
        } else {
          setGarmentImage(file);
          setGarmentPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (modelImage) formData.append("modelImage", modelImage);
    if (garmentImage) formData.append("garmentImage", garmentImage);
    if (category !== "none") formData.append("category", category);
    formData.append("nSamples", nSamples.toString());
    formData.append("nSteps", nSteps.toString());
    formData.append("imageScale", imageScale.toString());
    formData.append("seed", seed.toString());

    try {
      const response = await fetch("/api/generate-outfit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to generate outfit: ${response.status} ${response.statusText}`
        );
      }

      if (!data.success || !data.result) {
        throw new Error("No result received from the server");
      }

      const imageData = data.result;
      if (
        typeof imageData !== "string" ||
        (!imageData.startsWith("data:image") && !imageData.startsWith("http"))
      ) {
        throw new Error("Invalid image data received");
      }

      setResult(imageData);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unexpected error occurred while generating the outfit");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    try {
      const response = await fetch(result);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-outfit-${Date.now()}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading image:", err);
      setError("Failed to download the image");
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Virtual Try-On Experience
          </h1>
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-4xl font-bold text-[#3B82F6]">using AI</span>
            <span className="text-4xl font-bold">for everyone.</span>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Take a picture of yourself and instantly try on any clothing item.
            See how different garments look on you before making a purchase!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Try On Clothes</CardTitle>
              <CardDescription className="text-gray-400">
                Upload your photo and the garment you want to try
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="modelImage">Model Image</Label>
                    <div className="mt-2 space-y-2">
                      <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Input
                          id="modelImage"
                          type="file"
                          onChange={(e) => handleImageChange(e, "model")}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="modelImage"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          {modelPreview ? (
                            <Image
                              src={modelPreview}
                              alt="Model preview"
                              width={200}
                              height={200}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <>
                              <Upload className="h-12 w-12 text-gray-400" />
                              <span className="mt-2 text-sm text-gray-500">
                                Upload model image
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="garmentImage">Garment Image</Label>
                    <div className="mt-2 space-y-2">
                      <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Input
                          id="garmentImage"
                          type="file"
                          onChange={(e) => handleImageChange(e, "garment")}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="garmentImage"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          {garmentPreview ? (
                            <Image
                              src={garmentPreview}
                              alt="Garment preview"
                              width={200}
                              height={200}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <>
                              <ImageIcon className="h-12 w-12 text-gray-400" />
                              <span className="mt-2 text-sm text-gray-500">
                                Upload garment image
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Garment Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          None (HD Processing)
                        </SelectItem>
                        <SelectItem value="Upper-body">Upper Body</SelectItem>
                        <SelectItem value="Lower-body">Lower Body</SelectItem>
                        <SelectItem value="Dress">Dress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nSamples">
                      Number of Samples: {nSamples}
                    </Label>
                    <Slider
                      id="nSamples"
                      min={1}
                      max={4}
                      step={1}
                      value={[nSamples]}
                      onValueChange={(value) => setNSamples(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nSteps">Steps: {nSteps}</Label>
                    <Slider
                      id="nSteps"
                      min={1}
                      max={50}
                      step={1}
                      value={[nSteps]}
                      onValueChange={(value) => setNSteps(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageScale">
                      Guidance Scale: {imageScale.toFixed(1)}
                    </Label>
                    <Slider
                      id="imageScale"
                      min={0.1}
                      max={20}
                      step={0.1}
                      value={[imageScale]}
                      onValueChange={(value) => setImageScale(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seed">Random Seed</Label>
                    <Input
                      id="seed"
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-black/80 text-white border-none rounded-md"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Wand2 className="mr-2 h-4 w-4 animate-spin text-[#3B82F6]" />
                        <span className="text-[#3B82F6]">Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Wand2 className="mr-2 h-4 w-4 text-[#3B82F6]" />
                        <span className="text-white">Generate Outfit</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="animate-shimmer">
            <CardHeader>
              <CardTitle>Virtual Mirror</CardTitle>
              <CardDescription>
                See how the garment looks on you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="space-y-4 text-center p-8">
                  <Progress value={45} className="w-full" />
                  <p className="text-sm text-gray-500">
                    Processing your request...
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={result}
                      alt="Generated Outfit"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              )}

              {!loading && !error && !result && (
                <div className="h-[400px] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                  <p>Generated image will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
