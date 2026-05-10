type FormatType = "date" | "time" | "datetime";

export const formatDateUTC = (date: string, type: FormatType = "datetime") => {
  // treat database value as UTC
  const utcDate = new Date(date + "Z");

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour12: true,
  };

  // only date
  if (type === "date") {
    Object.assign(options, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // only time
  if (type === "time") {
    Object.assign(options, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // both date & time
  if (type === "datetime") {
    Object.assign(options, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return utcDate
    .toLocaleString("en-GB", options)
    .replace(/\//g, "-")
    .replace(",", "")
    .toUpperCase();
};
