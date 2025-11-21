import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { FormItemProps } from "@/shared/interfaces/form-item.props";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type MyMultiSelectProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & {
    placeholder?: string;
    searchPlaceholder?: string;
    options: { value: string | number | boolean; label: string }[];
    disabled?: boolean;
    className?: string;
    required?: boolean;
    maxItems?: number;
    emptyMessage?: string;
  };

const MyMultiSelect = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  placeholder = "Tanlang",
  searchPlaceholder = "Qidirish...",
  options,
  disabled,
  className,
  rules,
  floatingError,
  maxItems,
  emptyMessage = "Ma'lumot yo'q",
}: MyMultiSelectProps<TFieldValues>) => {
  const [open, setOpen] = useState(false);

  const labelElm = label && (
    <FormLabel className="my-3">
      {label} {required && <span className="text-red-600">*</span>}
    </FormLabel>
  );

  useEffect(() => {
    console.log('Ishladi')
  })

  return name && control ? (
    <FormField<TFieldValues, FieldPath<TFieldValues>>
      control={control}
      name={name}
      rules={rules}
      render={({ field, formState }) => {
        const error = formState.errors[name];

        // field.value ni array deb hisoblaymiz
        const selectedValues: Array<string | number | boolean> = Array.isArray(field.value) ? field.value : [];

        const selectedOptions = options.filter((opt) =>
          selectedValues.includes(opt.value)
        );

        const handleSelect = (value: string | number | boolean) => {
          if (selectedValues.includes(value)) {
            field.onChange(selectedValues.filter((v) => v !== value));
          } else {
            if (maxItems && selectedValues.length >= maxItems) return;
            field.onChange([...selectedValues, value]);
          }
        };

        const handleRemove = (value: string | number | boolean) => {
          field.onChange(selectedValues.filter((v) => v !== value));
        };

        return (
          <FormItem className="space-y-2">
            {labelElm}
            <div className="relative">
              <Command
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                }}
                className={cn("overflow-visible", className)}
              >
                <div
                  className={cn(
                    "group border rounded-md px-3 py-2 text-sm ring-offset-background",
                    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    error && "border-red-500",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex gap-1 flex-wrap">
                    {selectedOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="mr-1 mb-1"
                      >
                        {option.label}
                        <button
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleRemove(option.value)}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    ))}
                    <CommandInput
                      placeholder={selectedOptions.length === 0 ? placeholder : ""}
                      className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                      disabled={disabled}
                      onFocus={() => setOpen(true)}
                    />
                  </div>
                </div>

                {open && (
                  <div className="absolute w-full z-10 top-full mt-1">
                    <CommandList className="max-h-60 rounded-md border bg-popover text-popover-foreground shadow-md overflow-auto">
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => {
                          const isSelected = selectedValues.includes(option.value);
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => handleSelect(option.value)}
                              className="cursor-pointer"
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-40"
                                )}
                              >
                                {isSelected && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoinRound"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                              <span>{option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </div>
                )}
              </Command>

              {open && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setOpen(false)}
                />
              )}
            </div>

            <FormDescription>{helperText}</FormDescription>
            <FormMessage className={cn(floatingError && "absolute -bottom-6")} />
          </FormItem>
        );
      }}
    />
  ) : (
    <div className="space-y-2">
      {labelElm}
      <div className="text-sm text-muted-foreground">
        Form konteksti topilmadi. Faqat controlled holatda ishlaydi.
      </div>
    </div>
  );
};

export default MyMultiSelect;