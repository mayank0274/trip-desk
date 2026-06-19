import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 500,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function getRelativeDate(date: string) {
  const target = new Date(`${date}Z`);
  const now = new Date();

  const fmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const targetDateStr = fmt.format(target);
  const nowDateStr = fmt.format(now);

  const targetDateOnly = new Date(`${targetDateStr}T00:00:00Z`);
  const nowDateOnly = new Date(`${nowDateStr}T00:00:00Z`);

  const diffDays = Math.round(
    (nowDateOnly.getTime() - targetDateOnly.getTime()) / (1000 * 60 * 60 * 24),
  );

  const timeStr = target.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Today, ${timeStr}`;
  if (diffDays === 1) return `Yesterday, ${timeStr}`;

  return target.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
