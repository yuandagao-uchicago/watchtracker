import { WatchStatus, STATUS_LABELS } from "@/types";

const badgeStyles: Record<WatchStatus, string> = {
  watching: "bg-watching/10 text-watching border-watching/20",
  completed: "bg-completed/10 text-completed border-completed/20",
  plan_to_watch: "bg-plan/10 text-plan border-plan/20",
  dropped: "bg-dropped/10 text-dropped border-dropped/20",
};

export default function StatusBadge({ status }: { status: WatchStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wider uppercase ${badgeStyles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}
