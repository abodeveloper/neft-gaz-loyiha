import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemProps } from "@/shared/interfaces/form-item.props";
import { twMerge } from "tailwind-merge";
import { get } from "lodash";
import { cn } from "@/lib/utils";

export type MyCheckboxProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & {
    label?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
    required?: boolean;
    floatingError?: boolean;
  };

const MyCheckbox = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  disabled,
  className,
  rules,
  floatingError,
}: MyCheckboxProps<TFieldValues>) => {
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
        <FormItem
          className={twMerge([
            "flex flex-row items-start space-x-3 space-y-0",
            className,
          ])}
        >
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={twMerge([
                get(formState.errors, `${name}.message`) && "border-red-500",
              ])}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {labelElm}
            {helperText && <FormDescription>{helperText}</FormDescription>}
            <FormMessage className={cn(floatingError && "absolute")} />
          </div>
        </FormItem>
      )}
    />
  ) : (
    <div className="flex flex-row items-center space-x-3 space-y-0">
      <Checkbox disabled={disabled} />
      <div className="space-y-1 leading-none">
        {labelElm}
        {helperText && <FormDescription>{helperText}</FormDescription>}
      </div>
    </div>
  );
};

export default MyCheckbox;
