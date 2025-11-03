import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemProps } from "@/shared/interfaces/form-item.props";
import { twMerge } from "tailwind-merge";
import { get } from "lodash";
import { cn } from "@/lib/utils";

export type MySelectProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & {
    placeholder?: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
    className?: string;
    required?: boolean;
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
}: MySelectProps<TFieldValues>) => {
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
      render={({ field, formState }) => (
        <FormItem className="space-y-2">
          {labelElm}
          <Select
            onValueChange={(value) => {
              // Agar maydon nomi "status" bo‘lsa → boolean qaytar
              if (name === "status") {
                field.onChange(value === "true");
              } else {
                field.onChange(value);
              }
            }}
            value={
              // status bo‘lsa → boolean → string
              name === "status"
                ? field.value === true
                  ? "true"
                  : "false"
                : field.value?.toString()
            }
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={twMerge([
                  "mt-2",
                  get(formState.errors, `${name}.message`) && "border-red-500",
                  className,
                ])}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{helperText}</FormDescription>
          <FormMessage className={cn(floatingError && "absolute")} />
        </FormItem>
      )}
    />
  ) : (
    <div className="space-y-2">
      {labelElm}
      <Select defaultValue="" disabled={disabled}>
        <SelectTrigger className={twMerge(["mt-2", className])}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormDescription>{helperText}</FormDescription>
    </div>
  );
};

export default MySelect;
