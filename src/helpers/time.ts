export function formatMinutesToHourMinute(minutes?: number | null): string {
  if (minutes == null || isNaN(minutes)) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m} phút` : `${m} phút`;
}
