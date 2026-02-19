"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, ImageIcon } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import { CATEGORIES, CAMPUS_LOCATIONS } from "@/types";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  category: z.string().min(1, "Select a category"),
  price: z.number().min(1, "Price must be at least 1"),
  priceType: z.enum(["per_day", "fixed"]),
  condition: z.enum(["new", "good", "fair"]),
  location: z.string().min(1, "Select a location"),
  cod: z.boolean(),
  halfCash: z.boolean(),
  fullCash: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function ListingForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      priceType: "fixed",
      condition: "good",
      cod: true,
      halfCash: true,
      fullCash: true,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "image");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
      }
      toast.success("Images uploaded!");
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!data.cod && !data.halfCash && !data.fullCash) {
      toast.error("Select at least one payment option");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          images,
          price: data.price,
          priceType: data.priceType,
          condition: data.condition,
          paymentOptions: {
            cod: data.cod,
            halfCash: data.halfCash,
            fullCash: data.fullCash,
          },
          location: data.location,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      const listing = await res.json();
      toast.success("Listing created!");
      router.push(`/listings/${listing._id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Images */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Photos (max 5)
        </label>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-primary-500 hover:text-primary-500 dark:border-gray-600">
              {uploading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              ) : (
                <>
                  <ImageIcon className="h-6 w-6" />
                  <span className="mt-1 text-xs">Upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      <Input
        label="Title"
        placeholder="e.g., Engineering Mathematics Textbook"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description"
        placeholder="Describe your item, its condition, any accessories included..."
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          placeholder="Select category"
          error={errors.category?.message}
          {...register("category")}
        />
        <Select
          label="Condition"
          options={[
            { value: "new", label: "New / Like New" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
          ]}
          error={errors.condition?.message}
          {...register("condition")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Price (INR)"
          type="number"
          placeholder="500"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
        <Select
          label="Price Type"
          options={[
            { value: "fixed", label: "Fixed Price" },
            { value: "per_day", label: "Per Day" },
          ]}
          {...register("priceType")}
        />
      </div>

      <Select
        label="Meetup Location"
        options={CAMPUS_LOCATIONS.map((l) => ({ value: l, label: l }))}
        placeholder="Select campus location"
        error={errors.location?.message}
        {...register("location")}
      />

      {/* Payment Options */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Accepted Payment Methods
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register("cod")}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register("halfCash")}
            />
            50% Advance
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register("fullCash")}
            />
            100% Advance
          </label>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        <Upload className="h-4 w-4" />
        Publish Listing
      </Button>
    </form>
  );
}
