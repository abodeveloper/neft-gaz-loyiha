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
    height?: string; // masalan: "500px"
    required?: boolean;
  };

const MyEditor = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required = false,
  placeholder = "Matn kiriting...",
  height = "500px",
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
              {/* CKEditor + to'g'ri balandlik + Powered by yo'q */}
              <div
                className={cn(
                  "rounded-lg border overflow-hidden shadow-sm",
                  error
                    ? "border-red-500 ring-2 ring-red-500 ring-offset-2"
                    : "border-input"
                )}
                // CKEditor ichki editable maydoniga balandlik beramiz
                style={
                  {
                    // @ts-ignore – CKEditor ichki CSS variabllari
                    "--ck-editor-height": height,
                  } as React.CSSProperties
                }
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ""}
                  config={{
                    placeholder,
                    toolbar: [
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
                    // "Powered by CKEditor" ni butunlay o'chirish
                    removePlugins: ["CKFinder"],
                    // CKEditor 5 ning branding (footer) ni yo'q qilish
                    // Classic build’da faqat CSS orqali yo‘q qilinadi
                  }}
                  onChange={(_event: any, editor: any) => {
                    field.onChange(editor.getData());
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
