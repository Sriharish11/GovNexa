import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case "upcoming":
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "closed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      getStyles(status),
      className
    )}>
      {status}
    </span>
  );
}
