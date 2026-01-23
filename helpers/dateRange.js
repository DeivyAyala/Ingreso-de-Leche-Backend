const parseISODate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") {
    return null;
  }

  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    return null;
  }

  const [year, month, day] = parts.map((part) => Number(part));
  if (!year || !month || !day) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day));
};

export const getDateRange = (range, dateStr) => {
  const baseDate = parseISODate(dateStr);
  const now = new Date();
  const from = baseDate
    ? baseDate
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  let to = null;
  if (range === "day") {
    to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + 1));
  } else if (range === "week") {
    to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + 7));
  } else if (range === "month") {
    to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, from.getUTCDate()));
  } else if (range === "year") {
    to = new Date(Date.UTC(from.getUTCFullYear() + 1, from.getUTCMonth(), from.getUTCDate()));
  }

  if (!to || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return null;
  }

  return { from, to };
};
