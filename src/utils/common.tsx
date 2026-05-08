export const formatDate = (date: string) => {
  const d = new Date(date);

  return d
    .toLocaleDateString("en-GB", {
      timeZone: "Asia/Kolkata",
    })
    .replace(/\//g, "-");
};

export const formatDateTime = (date: string) => {
  return new Date(date)
    .toLocaleString("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(/\//g, "-")
    .toUpperCase();
};
