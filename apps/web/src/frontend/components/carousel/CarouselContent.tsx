interface CarouselContentProps {
	children: React.ReactNode;
}
const CarouselContent: React.FC<CarouselContentProps> = ({ children }) => {
	return (
		<div className="absolute right-30 -bottom-10 w-50 overflow-visible rounded-3xl bg-[#fafafa] shadow-lg">
			{children}
		</div>
	);
};
export default CarouselContent;
