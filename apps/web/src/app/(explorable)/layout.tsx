"use client";
import ExploreNavBar from "@/frontend/components/navbar/ExploreNavBar";
import { EditPhotoProvider } from "@/frontend/providers/EditPhotoProvider";

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
