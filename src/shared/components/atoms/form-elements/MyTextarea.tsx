import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemProps } from "@/shared/interfaces/form-item.props";
import { twMerge } from "tailwind-merge";
import { get } from "lodash";
import { cn } from "@/lib/utils";

export type MyTextareaProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> &
    Omit<TextareaProps, "value" | "onChange"> & {
      placeholder?: string;
      rows?: number;
      maxLength?: number;
      showCounter?: boolean;
    };

const MyTextarea = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  placeholder,
  rows = 4,
  maxLength,
  showCounter = false,
  className,
  rules,
  floatingError,
  ...props
}: MyTextareaProps<TFieldValues>) => {
  const labelElm = label && (
    <FormLabel className="my-3">
      {label} {required && <span className="text-red-600">*</span>}
    </FormLabel>
  );

  return name && control ? (
    <FormField<TFieldValues, FieldPath<TFieldValues>>
      control={control}
      name={name}
      rules={rules}
      render={({ field, formState }) => {
        const error = get(formState.errors, name);
        const currentLength = field.value?.length || 0;

        return (
          <FormItem>
            {labelElm}
            <FormControl>
              <div className="relative">
                <Textarea
                  placeholder={placeholder}
                  rows={rows}
                  maxLength={maxLength}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={twMerge([
                    "mt-2 resize-none",
                    error && "border-red-500 focus-visible:ring-red-500",
                    className,
                  ])}
                  {...props}
                />
                {showCounter && maxLength && (
                  <div
                    className={twMerge([
                      "absolute bottom-2 right-3 text-xs",
                      currentLength > maxLength * 0.9
                        ? "text-red-500"
                        : "text-muted-foreground",
                    ])}
                  >
                    {currentLength}/{maxLength}
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>{helperText}</FormDescription>
            <FormMessage className={cn(floatingError && "absolute")} />
          </FormItem>
        );
      }}
    />
  ) : (
    <div className="space-y-2">
      {labelElm}
      <Textarea
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={twMerge(["mt-2 resize-none", className])}
        {...props}
      />
      <FormDescription>{helperText}</FormDescription>
    </div>
  );
};

export default MyTextarea;
