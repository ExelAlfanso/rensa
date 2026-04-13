import Image from "next/image";
import Heading from "@/frontend/components/Heading";

const ForestSection = () => {
	return (
		<div className="relative h-full font-forum text-3xl text-white">
			<Image
				alt={""}
				fill
				priority
				sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
				src={"/forest.jpg"}
			/>
			<div className="absolute bottom-0 left-0 flex h-full w-full flex-col items-start justify-end p-15 text-left">
				<Heading size="l">A Beautiful Day to Escape</Heading>
				<p className="text-[16px]">@alfredawn</p>
			</div>
		</div>
	);
};

export default ForestSection;
