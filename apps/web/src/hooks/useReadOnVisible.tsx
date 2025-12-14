import { useNotificationContext } from "@/providers/NotificationProvider";
import { useRef, useEffect } from "react";

export default function useReadOnVisible(
  id: string,
  read: boolean,
  onVisible: () => void
) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (id === undefined) {
      return;
    }

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
          onVisible();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [read, onVisible, id]);

  return ref;
}
