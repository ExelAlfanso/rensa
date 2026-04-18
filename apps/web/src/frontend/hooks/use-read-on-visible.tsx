import { useEffect, useRef } from "react";

export default function useReadOnVisible(
	_id: string | undefined,
	read: boolean,
	onVisible: () => void
) {
	const ref = useRef<HTMLLIElement>(null);
	const onVisibleRef = useRef(onVisible);

	useEffect(() => {
		onVisibleRef.current = onVisible;
	}, [onVisible]);
	useEffect(() => {
		if (read) {
			return;
		}

		const element = ref.current;

		if (!element) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					onVisibleRef.current();
					observer.disconnect();
				}
			},
			{ threshold: 0.5 }
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [read]);

	return ref;
}
