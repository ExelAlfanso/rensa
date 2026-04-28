import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
	onOutsideClick: (event: MouseEvent) => void
) {
	const ref = useRef<T>(null);
	const latestOnOutsideClickRef = useRef(onOutsideClick);

	useEffect(() => {
		latestOnOutsideClickRef.current = onOutsideClick;
	}, [onOutsideClick]);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				latestOnOutsideClickRef.current(event);
			}
		}

		document.addEventListener("mousedown", handleClick);
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, []);

	return ref;
}
