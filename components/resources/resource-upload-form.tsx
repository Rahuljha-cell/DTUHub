"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, FileUp, Link as LinkIcon } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import { BRANCHES, RESOURCE_TYPES } from "@/types";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  subject: z.string().min(1, "Subject is required"),
  semester: z.number().min(1).max(8),
  branch: z.string().min(1, "Branch is required"),
  type: z.string().min(1, "Type is required"),
  link: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function ResourceUploadForm() {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { semester: 1 },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "document");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFileUrl(data.url);
      toast.success("File uploaded!");
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (uploadMode === "file" && !fileUrl) {
      toast.error("Please upload a file");
      return;
    }
    if (uploadMode === "link" && !data.link) {
      toast.error("Please provide a link");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          subject: data.subject,
          semester: data.semester,
          branch: data.branch,
          type: data.type,
          fileUrl: uploadMode === "file" ? fileUrl : undefined,
          link: uploadMode === "link" ? data.link : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      toast.success("Resource shared!");
      router.push("/resources");
    } catch (error: any) {
      toast.error(error.message || "Failed to share resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Title"
        placeholder="e.g., Engineering Mathematics III - Unit 1 Notes"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description (optional)"
        placeholder="Brief description of this resource..."
        rows={3}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Subject"
          placeholder="e.g., Mathematics III"
          error={errors.subject?.message}
          {...register("subject")}
        />
        <Select
          label="Type"
          options={RESOURCE_TYPES.map((t) => ({
            value: t.value,
            label: t.label,
          }))}
          placeholder="Select type"
          error={errors.type?.message}
          {...register("type")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Semester"
          options={Array.from({ length: 8 }, (_, i) => ({
            value: String(i + 1),
            label: `Semester ${i + 1}`,
          }))}
          {...register("semester", { valueAsNumber: true })}
        />
        <Select
          label="Branch"
          options={BRANCHES.map((b) => ({ value: b, label: b }))}
          placeholder="Select branch"
          error={errors.branch?.message}
          {...register("branch")}
        />
      </div>

      {/* File or Link */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resource Source
        </label>
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              uploadMode === "file"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <FileUp className="h-4 w-4" /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadMode("link")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              uploadMode === "link"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <LinkIcon className="h-4 w-4" /> External Link
          </button>
        </div>

        {uploadMode === "file" ? (
          <div>
            {fileUrl ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                <FileUp className="h-4 w-4" /> File uploaded successfully
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-gray-400 transition-colors hover:border-primary-500 hover:text-primary-500 dark:border-gray-600">
                {uploading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8" />
                    <span className="text-sm">
                      Click to upload PDF, DOC, or image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        ) : (
          <Input
            placeholder="https://drive.google.com/..."
            error={errors.link?.message}
            {...register("link")}
          />
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        <Upload className="h-4 w-4" /> Share Resource
      </Button>
    </form>
  );
}
