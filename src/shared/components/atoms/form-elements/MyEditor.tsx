// components/MyEditor.tsx
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemProps } from "@/shared/interfaces/form-item.props";
import { cn } from "@/lib/utils";
import { get } from "lodash";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export type MyEditorProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & {
    placeholder?: string;
    height?: string;
    required?: boolean;
    disabled?: boolean; // Yangi qo'shildi!
  };

const MyEditor = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required = false,
  placeholder = "Matn kiriting...",
  height = "500px",
  disabled = false, // Default: yoqilmagan
  rules,
  floatingError,
}: MyEditorProps<TFieldValues>) => {
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
          CKEditor faqat form ichida ishlaydi
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
                  "overflow-hidden shadow-sm transition-all",
                  error
                    ? "border-red-500 ring-2 ring-red-500 ring-offset-2"
                    : "border-input",
                  disabled && "opacity-70 bg-gray-50 cursor-not-allowed"
                )}
                style={{ "--ck-editor-height": height } as React.CSSProperties}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ""}
                  disabled={disabled} // CKEditor o'zining disabled rejimi
                  config={{
                    placeholder,
                    toolbar: disabled
                      ? [] // Agar disabled bo'lsa, toolbar butunlay yo'q
                      : [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "|",
                          "outdent",
                          "indent",
                          "|",
                          "link",
                          "blockquote",
                          "imageUpload",
                          "insertTable",
                          "mediaEmbed",
                          "|",
                          "undo",
                          "redo",
                        ],
                    image: {
                      toolbar: [
                        "imageStyle:inline",
                        "imageStyle:block",
                        "imageStyle:side",
                        "|",
                        "toggleImageCaption",
                        "imageTextAlternative",
                      ],
                    },
                    // Disabled holatda ham rasm yuklashni bloklash
                    ...(disabled && { readOnly: true }),
                  }}
                  onReady={(editor) => {
                    if (!disabled) {
                      // Faqat enabled bo'lganda adapter ishlaydi
                      editor.plugins.get("FileRepository").createUploadAdapter =
                        (loader) => {
                          return {
                            upload() {
                              return loader.file.then(
                                (file) =>
                                  new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () =>
                                      resolve({ default: reader.result });
                                    reader.onerror = (error) => reject(error);
                                    reader.readAsDataURL(file);
                                  })
                              );
                            },
                            abort() {},
                          };
                        };
                    }
                  }}
                  onChange={(_event: any, editor: any) => {
                    if (!disabled) {
                      field.onChange(editor.getData());
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
