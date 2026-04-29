// src/stores/useAuthStore.ts

import type { Session } from "next-auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useRollsStore } from "./useRollsStore";

interface AuthState {
	accessToken?: string;
	clearAuth: () => void;
	isLoading: boolean;
	logout: () => void;
	setAccessToken: (token?: string) => void;
	setLoading: (loading: boolean) => void;
	setUser: (user: Session["user"] | null) => void;
	user: Session["user"] | null;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: undefined,
			isLoading: true,
			setUser: (user) => set({ user }),
			setAccessToken: (token) => set({ accessToken: token }),
			setLoading: (isLoading) => set({ isLoading }),
			clearAuth: () =>
				set({ user: null, accessToken: undefined, isLoading: false }),
			logout: () => {
				set({ user: null });
				useRollsStore.getState().clearRolls();
			},
		}),
		{
			name: "auth-store", // stored in sessionStorage
			storage: {
				getItem: (name) => {
					const item = sessionStorage.getItem(name);
					return item ? JSON.parse(item) : null;
				},
				setItem: (name, value) =>
					sessionStorage.setItem(name, JSON.stringify(value)),
				removeItem: (name) => sessionStorage.removeItem(name),
			},
		}
	)
);

