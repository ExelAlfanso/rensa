"use client";
import ExploreNavbar from "@/frontend/components/navbar/ExploreNavbar";
import { EditPhotoProvider } from "@/frontend/providers/EditPhotoProvider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<EditPhotoProvider>
			<div className="flex items-center justify-center">
				<ExploreNavbar />
				{children}
			</div>
		</EditPhotoProvider>
	);
}
