"use client";
import ExploreNavBar from "@/components/navbar/ExploreNavBar";
import { EditPhotoProvider } from "@/providers/EditPhotoProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EditPhotoProvider>
      <div className="flex items-center justify-center">
        <ExploreNavBar />
        {children}
      </div>
    </EditPhotoProvider>
  );
}
