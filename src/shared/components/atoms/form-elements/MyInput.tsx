import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input, InputProps } from "@/components/ui/input.tsx";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemProps } from "@/shared/interfaces/form-item.props.ts";
import { twMerge } from "tailwind-merge";
import { get } from "lodash";
import { cn } from "@/lib/utils";

export type MyInputProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & InputProps;

const MyInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  className,
  rules,
  floatingError,
  ...props
}: MyInputProps<TFieldValues>) => {
  const labelElm = label && (
    <FormLabel className={"my-3"}>
      {label} {required && <span className={"text-red-600"}>*</span>}
    </FormLabel>
  );

  return name && control ? (
    <FormField<TFieldValues, FieldPath<TFieldValues>>
      control={control}
      name={name}
      rules={rules}
      render={({ field, formState }) => (
        <FormItem>
          {labelElm}
          <FormControl>
            <Input
              variant={
                get(formState.errors, `${name}.message`) ? "failure" : "default"
              }
              {...props}
              {...field}
              onChange={(event) => {
                const value = event.target.value;
                if (props.type === "number") {
                  field.onChange(value ? Number(value) : undefined);
                } else {
                  field.onChange(value);
                }
              }}
              className={twMerge(["mt-2", className])}
            />
          </FormControl>
          <FormDescription>{helperText}</FormDescription>
          <FormMessage className={cn(floatingError && "absolute")} />
        </FormItem>
      )}
    />
  ) : (
    <>
      {labelElm}
      <Input {...props} className={twMerge(["mt-2", className])} />
      <FormDescription>{helperText}</FormDescription>
    </>
  );
};

export default MyInput;
