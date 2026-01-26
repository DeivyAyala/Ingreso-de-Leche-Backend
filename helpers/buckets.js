const DAY_NAMES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const pad2 = (value) => String(value).padStart(2, "0");

const toDateKey = (date) =>
  `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;

const toMonthKey = (date) =>
  `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}`;

const addDaysUTC = (date, days) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));

const addMonthsUTC = (date, months) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));

export const buildBuckets = (range, from, to) => {
  const labels = [];
  const keys = [];

  if (range === "day") {
    for (let hour = 0; hour < 24; hour += 1) {
      labels.push(pad2(hour));
      keys.push(hour);
    }
    return { labels, keys };
  }

  if (range === "year") {
    let cursor = new Date(from);
    while (cursor < to) {
      labels.push(MONTH_NAMES[cursor.getUTCMonth()]);
      keys.push(toMonthKey(cursor));
      cursor = addMonthsUTC(cursor, 1);
    }
    return { labels, keys };
  }

  let cursor = new Date(from);
  while (cursor < to) {
    if (range === "week") {
      labels.push(DAY_NAMES[cursor.getUTCDay()]);
    } else {
      labels.push(String(cursor.getUTCDate()));
    }
    keys.push(toDateKey(cursor));
    cursor = addDaysUTC(cursor, 1);
  }

  return { labels, keys };
};

export const buildGroupExpression = (range, field, timeZone = "America/Bogota") => {
  if (range === "day") {
    return { $hour: { date: `$${field}`, timezone: timeZone } };
  }

  if (range === "year") {
    return { $dateToString: { format: "%Y-%m", date: `$${field}`, timezone: timeZone } };
  }

  return { $dateToString: { format: "%Y-%m-%d", date: `$${field}`, timezone: timeZone } };
};
