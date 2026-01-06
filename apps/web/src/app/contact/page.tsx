"use client";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white-500 items-center justify-center text-primary py-10">
      <div className="w-full flex items-start px-5 md:px-10 xl:px-65 mb-8">
        <button
          onClick={() => router.back()}
          className="transition-colors duration-300 cursor-pointer text-primary hover:text-gray-500"
        >
          <ArrowLeftIcon size={32} />
        </button>
      </div>
      <ContactForm />
    </div>
  );
}
