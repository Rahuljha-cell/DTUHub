import ResourceUploadForm from "@/components/resources/resource-upload-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadResourcePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/resources"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to resources
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Share a Resource
      </h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Help your fellow DTU students by sharing notes, PYQs, assignments, or
        useful links.
      </p>
      <ResourceUploadForm />
    </div>
  );
}
