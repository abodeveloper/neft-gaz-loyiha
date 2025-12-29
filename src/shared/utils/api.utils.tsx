
// 1. Pure Function (Oddiy mantiq)
export const cleanParams = (params: Record<string, any>) => {
  const cleaned: Record<string, any> = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value === null || value === undefined) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    cleaned[key] = value;
  });

  return cleaned;
};
