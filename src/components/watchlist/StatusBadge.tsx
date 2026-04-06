import { WatchStatus, STATUS_LABELS } from "@/types";

const badgeStyles: Record<WatchStatus, string> = {
  watching: "bg-watching/15 text-watching border-watching/30",
  completed: "bg-completed/15 text-completed border-completed/30",
  plan_to_watch: "bg-plan/15 text-plan border-plan/30",
  dropped: "bg-dropped/15 text-dropped border-dropped/30",
};

export default function StatusBadge({ status }: { status: WatchStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded border text-xs font-semibold tracking-wide uppercase ${badgeStyles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
