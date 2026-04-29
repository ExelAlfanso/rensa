import Text from "@/frontend/components/Text";
import { FilterLists } from "@/frontend/data/filterDatas";
import { cn } from "@/utils/cn";

export interface FilterListViewProps {
	activeFilters: string[];
	onClear: () => void;
	onToggleFilter: (label: string) => void;
}

const FilterListView: React.FC<FilterListViewProps> = ({
	activeFilters,
	onClear,
	onToggleFilter,
}) => (
	<div className="px-3">
		<div className="mb-11 grid w-full grid-cols-2 grid-rows-2 pt-50 text-black md:justify-between lg:flex lg:flex-row">
			{FilterLists.map((list, idx) => (
				<div key={idx}>
					<Text className="font-light text-white-700" size="s">
						{list.title}
					</Text>
					<div
						className={cn(
							"grid",
							list.column === 1 ? "grid-cols-1" : "grid-cols-2 gap-x-10"
						)}
					>
						{list.items.map((item, idx) => {
							const isActive = activeFilters.includes(item.label.toLowerCase());

							return (
								<div
									className="font-forum text-[14px] sm:text-[20px] lg:text-2xl 2xl:text-3xl"
									key={idx}
								>
									<button
										className="relative mr-5 cursor-pointer pb-1 transition-colors duration-300 hover:text-gray-700"
										onClick={() => onToggleFilter(item.label)}
									>
										<span>{item.label}</span>
										<span
											className={cn(
												"absolute bottom-0 left-0 h-0.5 w-full origin-left transform bg-orange-500 transition-transform duration-300",
												isActive ? "scale-x-100" : "scale-x-0"
											)}
										/>
									</button>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>

		{activeFilters.length > 0 && (
			<button
				className="cursor-pointer rounded-full border-0 bg-[#BC0E0E] px-4 py-2 font-semibold text-white-500 outline-0 ring-0 transition-colors duration-300 hover:bg-red-500 hover:text-white-100"
				onClick={onClear}
			>
				Clear
			</button>
		)}
	</div>
);

export default FilterListView;
