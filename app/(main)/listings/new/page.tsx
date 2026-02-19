import ListingForm from "@/components/listings/listing-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/browse"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        List an Item
      </h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Share something you want to rent out to fellow DTU students.
      </p>
      <ListingForm />
    </div>
  );
}
