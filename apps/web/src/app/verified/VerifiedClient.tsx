"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Footer from "@/frontend/components/footer/Footer";
import Text from "@/frontend/components/Text";

export default function VerifiedClient() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full bg-white">
      <div className="relative flex flex-col justify-between min-h-screen text-black rounded-b-3xl">
        <Image
          src="/images/not-found/not-found.png"
          alt="Not found"
          width={0}
          height={0}
          sizes="100vw"
          className="absolute inset-0 w-full xl:w-[75%] h-auto mx-auto object-contain self-end "
        />
        <Image
          src="/images/not-found/pic.png"
          alt="Not found"
          width={0}
          height={0}
          sizes="100vw"
          className="absolute top-20 right-20 xl:size-auto"
        />
        <Image
          src="/images/not-found/pic2.png"
          alt="Not found"
          width={0}
          height={0}
          sizes="100vw"
          className="absolute bottom-0 size-auto "
        />

        <div className="absolute flex flex-col items-center justify-center w-full min-h-screen -top-15 md:-top-30">
          <Image
            src="/verified.svg"
            alt="Verified"
            width={0}
            height={0}
            className="w-50"
          />
          <h1 className="text-[28px] md:text-[38px] font-forum">
            Your email has been verified
          </h1>
          <h2 className="text-[20px] md:text-[26px] font-forum mb-5 md:mb-10">
            Log in to start enjoying Rensa.
          </h2>
          <div className="flex items-center gap-4">
            <Text size="m" className="">
              Redirecting to the login page...
            </Text>
            <div className=" loading loading-spinner"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
