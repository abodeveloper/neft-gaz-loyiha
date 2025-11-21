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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemProps } from "@/shared/interfaces/form-item.props";
import { twMerge } from "tailwind-merge";
import { get } from "lodash";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export type MySelectProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & {
    placeholder?: string;
    options: { value: string | boolean | number; label: string }[];
    disabled?: boolean;
    className?: string;
    required?: boolean;
    multiple?: boolean;
    searchPlaceholder?: string;
    searchable?: boolean;
  };

const MySelect = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  placeholder = "Tanlang",
  options,
  disabled,
  className,
  rules,
  floatingError,
  multiple = false,
  searchPlaceholder = "Qidirish...",
  searchable = false,
}: MySelectProps<TFieldValues>) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );

  const labelElm = label && (
    <FormLabel className="my-3">
      {label} {required && <span className="text-red-600">*</span>}
    </FormLabel>
  );

  const formatValue = (value: any) => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return value ?? (multiple ? [] : "");
  };

  const removeValue = (currentValue: any[], valueToRemove: any) => {
    return currentValue.filter((v) => v !== valueToRemove);
  };

  // Trigger kengligini o‘lchash
  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  return name && control ? (
    <FormField<TFieldValues, FieldPath<TFieldValues>>
      control={control}
      name={name}
      rules={rules}
      render={({ field, formState }) => {
        const currentValue = formatValue(field.value);
        const hasError = !!get(formState.errors, `${name}.message`);
        const selectedOption = !multiple
          ? options.find((opt) => opt.value === field.value)
          : null;

        return (
          <FormItem className="space-y-2">
            {labelElm}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={twMerge(
                      "w-full justify-between font-normal mt-2 h-auto min-h-10 py-2 text-left",
                      hasError && "border-red-500",
                      className
                    )}
                    disabled={disabled || options.length === 0}
                  >
                    <div className="flex flex-wrap gap-1 flex-1 items-center pr-2">
                      {multiple && currentValue.length > 0 ? (
                        currentValue.map((val: any) => {
                          const option = options.find(
                            (opt) => opt.value === val
                          );
                          return option ? (
                            <span
                              key={val}
                              className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                            >
                              {option.label}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(
                                    removeValue(currentValue, val)
                                  );
                                }}
                                className="ml-1 hover:text-red-600 focus:outline-none"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ) : null;
                        })
                      ) : (
                        <span className="text-muted-foreground">
                          {selectedOption ? selectedOption.label : placeholder}
                        </span>
                      )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent
                className="p-0"
                align="start"
                style={{ width: triggerWidth ? `${triggerWidth}px` : "100%" }}
              >
                <Command>
                  {searchable && (
                    <CommandInput placeholder={searchPlaceholder} />
                  )}
                  <CommandEmpty>
                    {searchable ? "Ma'lumot yo'q" : "Hech narsa topilmadi"}
                  </CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {options.map((option) => {
                      const isSelected = multiple
                        ? currentValue.includes(option.value)
                        : field.value === option.value;

                      return (
                        <CommandItem
                          key={String(option.value)}
                          onSelect={() => {
                            let newValue: any;

                            if (multiple) {
                              newValue = isSelected
                                ? removeValue(currentValue, option.value)
                                : [...currentValue, option.value];
                            } else {
                              newValue = isSelected ? "" : option.value;
                              setOpen(false);
                            }

                            field.onChange(newValue);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>{helperText}</FormDescription>
            <FormMessage className={cn(floatingError && "absolute")} />
          </FormItem>
        );
      }}
    />
  ) : (
    <div className="space-y-2">
      {labelElm}
      <Button
        variant="outline"
        disabled
        className="w-full justify-between mt-2"
      >
        <span className="truncate">{placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <FormDescription>{helperText}</FormDescription>
    </div>
  );
};

export default MySelect;
