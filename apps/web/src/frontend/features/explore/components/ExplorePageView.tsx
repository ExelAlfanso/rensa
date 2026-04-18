import ExploreGalleryContainer from "../containers/ExploreGalleryContainer";
import ExploreFilterControlsView from "./ExploreFilterControlsView";
import ExploreTabsControlView from "./ExploreTabsControlView";

interface ExplorePageControlsModel {
	activeFilters: string[];
	activeTabId: string;
	onClearFilters: () => void;
	onTabChange: (tabId: string) => void;
	onToggleFilter: (label: string) => void;
}

interface ExplorePageViewProps {
	controlsModel: ExplorePageControlsModel;
}

const ExplorePageView: React.FC<ExplorePageViewProps> = ({ controlsModel }) => {
	const sort = controlsModel.activeTabId === "tab2" ? "popular" : "recent";

	return (
		<main className="flex min-h-screen w-full flex-col items-center bg-white-500">
			<section className="flex w-full flex-col justify-center px-6.25 md:px-7.5 lg:px-17.5 xl:px-22.5 2xl:px-65">
				<ExploreFilterControlsView
					activeFilters={controlsModel.activeFilters}
					onClearFilters={controlsModel.onClearFilters}
					onToggleFilter={controlsModel.onToggleFilter}
				/>
				<hr className="my-11 border-white-700" />
				<section aria-labelledby="explore-sort-heading">
					<h2 className="sr-only" id="explore-sort-heading">
						Explore sorting
					</h2>
					<ExploreTabsControlView
						activeTabId={controlsModel.activeTabId}
						className="mb-10"
						onTabChange={controlsModel.onTabChange}
					/>
				</section>
				<div className="flex items-start">
					<ExploreGalleryContainer
						filters={controlsModel.activeFilters}
						sort={sort}
					/>
				</div>
			</section>
		</main>
	);
};

export default ExplorePageView;
