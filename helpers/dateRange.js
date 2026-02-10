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

  return { year, month, day };
};

const getDatePartsInTimeZone = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
  };
};

export const getDateRange = (range, dateStr, timeZone = "America/Bogota") => {
  const baseDate = parseISODate(dateStr);
  const now = new Date();
  const today = getDatePartsInTimeZone(now, timeZone);

  const base = baseDate || today;

  const baseAtMidnightBogotaUtc = new Date(
    Date.UTC(base.year, base.month - 1, base.day, 5, 0, 0)
  );

  let from = null;

  let to = null;
  if (range === "day") {
    from = baseAtMidnightBogotaUtc;
    to = new Date(
      Date.UTC(
        from.getUTCFullYear(),
        from.getUTCMonth(),
        from.getUTCDate() + 1,
        5,
        0,
        0
      )
    );
  } else if (range === "week") {
    const weekday = baseAtMidnightBogotaUtc.getUTCDay(); // 0=Sun, 1=Mon
    const daysSinceMonday = (weekday + 6) % 7;
    from = new Date(
      Date.UTC(
        baseAtMidnightBogotaUtc.getUTCFullYear(),
        baseAtMidnightBogotaUtc.getUTCMonth(),
        baseAtMidnightBogotaUtc.getUTCDate() - daysSinceMonday,
        5,
        0,
        0
      )
    );
    to = new Date(
      Date.UTC(
        from.getUTCFullYear(),
        from.getUTCMonth(),
        from.getUTCDate() + 7,
        5,
        0,
        0
      )
    );
  } else if (range === "month") {
    from = new Date(Date.UTC(base.year, base.month - 1, 1, 5, 0, 0));
    to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1, 5, 0, 0));
  } else if (range === "year") {
    from = new Date(Date.UTC(base.year, 0, 1, 5, 0, 0));
    to = new Date(Date.UTC(from.getUTCFullYear() + 1, 0, 1, 5, 0, 0));
  }

  if (!from || !to || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return null;
  }

  return { from, to, timeZone };
};
