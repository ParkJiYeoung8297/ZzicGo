// utils
export function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
