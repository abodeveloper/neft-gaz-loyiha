import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FormItemProps } from "@/shared/interfaces/form-item.props";
import { get } from "lodash";
import { FieldPath, FieldValues } from "react-hook-form";

import { Editor } from "@tinymce/tinymce-react";
import { useTranslation } from "react-i18next";

export type MyEditorProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & {
    placeholder?: string;
    height?: number;
    required?: boolean;
    disabled?: boolean;
  };

const MyEditor = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required = false,
  placeholder,
  height = 500,
  disabled = false,
  rules,
  floatingError,
}: MyEditorProps<TFieldValues>) => {
  const { t } = useTranslation();

  const labelElm = label && (
    <FormLabel className="my-3 block">
      {label} {required && <span className="text-red-600">*</span>}
    </FormLabel>
  );

  if (!name || !control) {
    return (
      <div className="space-y-3">
        {labelElm}
        <div className="border-2 border-dashed rounded-xl p-10 text-center text-muted-foreground">
          TinyMCE faqat form ichida ishlaydi
        </div>
      </div>
    );
  }

  return (
    <FormField<TFieldValues, FieldPath<TFieldValues>>
      control={control}
      name={name}
      rules={rules}
      render={({ field, formState }) => {
        const error = get(formState.errors, name);

        return (
          <FormItem>
            {labelElm}

            <FormControl>
              <div
                className={cn(
                  "rounded-sm overflow-hidden shadow-sm transition-all",
                  error && "border-red-500 ring-2 ring-red-500 ring-offset-2",
                  disabled && "opacity-70 bg-gray-50 cursor-not-allowed"
                )}
              >
                <Editor
                  apiKey={import.meta.env.VITE_TINY_EDITOR_KEY_2} // O'zingizniki bo'lsa almashtiring yoki .env ga qo'ying
                  value={field.value || ""}
                  disabled={disabled}
                  init={{
                    min_height: height, // Minimal balandlik
                    // autoresize_bottom_margin: 20,
                    menubar: true,
                    placeholder: placeholder || t("Type your text here..."),
                    branding: false,
                    resize: true,
                    content_style:
                      "body { font-family: inherit; font-size: 14px; }",
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      // "help",
                      // "wordcount",
                      "emoticons",
                      "codesample",
                      "autoresize",
                      "save",
                      "directionality",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | \
                      alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | \
                      link image media table | emoticons charmap | removeformat | code fullscreen",
                    image_advtab: true,
                    file_picker_types: "image",
                    automatic_uploads: true,
                    images_upload_handler: async (blobInfo) => {
                      const file = blobInfo.blob();
                      const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                      });
                      return base64;
                    },
                    // Disabled holatda faqat o'qish rejimi
                    readonly: disabled,
                  }}
                  onEditorChange={(content) => {
                    if (!disabled) {
                      field.onChange(content);
                    }
                  }}
                />
              </div>
            </FormControl>

            {helperText && <FormDescription>{helperText}</FormDescription>}
            <FormMessage
              className={cn(floatingError && "absolute -bottom-6")}
            />
          </FormItem>
        );
      }}
    />
  );
};

export default MyEditor;
