"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormItemProps } from "@/shared/interfaces/form-item.props.ts";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { FieldPath, FieldValues } from "react-hook-form";

export type MyDateTimePickerProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues>;

const MyDateTimePicker = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required,
  rules,
  className,
}: MyDateTimePickerProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name as FieldPath<TFieldValues>}
      rules={rules}
      render={({ field }) => {
        const dateValue =
          field.value instanceof Date ? field.value : new Date();

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const [hours, minutes] = e.target.value.split(":").map(Number);
          const newDate = new Date(dateValue);
          newDate.setHours(hours || 0);
          newDate.setMinutes(minutes || 0);
          field.onChange(newDate);
        };

        const handleDateSelect = (selectedDate: Date | undefined) => {
          if (selectedDate) {
            const newDate = new Date(selectedDate);
            newDate.setHours(dateValue.getHours());
            newDate.setMinutes(dateValue.getMinutes());
            field.onChange(newDate);
          }
        };

        return (
          <FormItem className={cn("space-y-1", className)}>
            {label && (
              <FormLabel className="text-sm font-medium">
                {label} {required && <span className="text-red-600">*</span>}
              </FormLabel>
            )}

            <div className="flex flex-row items-center gap-2 max-w-xs">
              {/* DATE PICKER PART */}
              <div className="flex flex-col gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-36 justify-between font-normal px-3",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? format(field.value, "dd.MM.yyyy")
                          : "Sana"}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* TIME PICKER PART */}
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Input
                    type="time"
                    step="60"
                    className="w-28 bg-background px-3"
                    value={field.value ? format(field.value, "HH:mm") : ""}
                    onChange={handleTimeChange}
                  />
                </FormControl>
              </div>
            </div>

            <FormMessage className="text-[12px]" />
          </FormItem>
        );
      }}
    />
  );
};

export default MyDateTimePicker;
