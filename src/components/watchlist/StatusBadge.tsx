import { WatchStatus, STATUS_LABELS } from "@/types";
import { getStatusColor } from "@/lib/utils";

export default function StatusBadge({ status }: { status: WatchStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
