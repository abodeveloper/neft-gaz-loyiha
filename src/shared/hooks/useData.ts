import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseDataOptions<T> {
  fetchFn: () => Promise<T[]>;
  labelKey?: keyof T | ((item: T) => string);
  valueKey?: keyof T | ((item: T) => string | number);
  queryKey?: string[];
  placeholder?: { label: string; value: string | number };
  dataOnly?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export const useData = <T>({
  fetchFn,
  labelKey,
  valueKey,
  queryKey = ["data"],
  placeholder,
  dataOnly = false,
}: UseDataOptions<T>) => {
  const { data, isLoading, isError, error } = useQuery<T[]>({
    queryKey,
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000,
  });

  const options = useMemo<SelectOption[]>(() => {
    if (!data || dataOnly) return [];

    if (!labelKey || !valueKey) return [];

    return data?.map((item) => ({
      label:
        typeof labelKey === "function"
          ? labelKey(item)
          : String(item[labelKey]),
      value: String(
        typeof valueKey === "function" ? valueKey(item) : item[valueKey]
      ),
    }));
  }, [data, labelKey, valueKey, dataOnly]);

  const finalOptions = useMemo<SelectOption[]>(() => {
    if (!placeholder || dataOnly) return options;
    return [
      { label: placeholder.label, value: String(placeholder.value) },
      ...options,
    ];
  }, [options, placeholder, dataOnly]);

  // HAR DOIM ARRAY!
  const safeOptions = finalOptions ?? [];

  if (dataOnly) {
    return {
      data: data || [],
      isLoading,
      isError,
      error,
    };
  }

  return {
    data: data || [],
    options: safeOptions, // Hech qachon undefined!
    isLoading,
    isError,
    error,
  };
};
