"use client";

import { useAuthStore } from "@/frontend/stores/useAuthStore";
import ExploreNavbarView from "../components/ExploreNavbarView";

const ExploreNavbarContainer = () => {
	const user = useAuthStore((state) => state.user);

	console.log("ExploreNavbarContainer: user", user);
	return <ExploreNavbarView user={user} />;
};

export default ExploreNavbarContainer;
