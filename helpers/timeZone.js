export const toUtcDate = (value) => {
  if (!value) {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    if (value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value)) {
      return new Date(value);
    }

    const normalized = value.length === 10
      ? `${value}T00:00:00-05:00`
      : value.length === 16
        ? `${value}:00-05:00`
        : value.length === 19
          ? `${value}-05:00`
          : value;

    return new Date(normalized);
  }

  return new Date(value);
};
