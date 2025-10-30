import { Button } from "@/components/ui/button";
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
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type MyFileInputProps<TFieldValues extends FieldValues> =
  FormItemProps<TFieldValues> & {
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // KB
    placeholder?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
  };

const MyFileInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  accept = "image/*",
  multiple = false,
  maxSize = 5120, // 5MB
  placeholder = "Click or drag to upload image",
  disabled,
  rules,
  floatingError,
}: MyFileInputProps<TFieldValues>) => {
  const { t } = useTranslation();

  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const index = Math.max(0, Math.min(i, sizes.length - 1));
    return `${parseFloat((bytes / Math.pow(k, index)).toFixed(2))} ${
      sizes[index]
    }`;
  };

  const validateFile = (file: File) => {
    if (maxSize && file.size > maxSize * 1024) {
      return `Fayl hajmi ${formatFileSize(
        maxSize * 1024
      )} dan oshmasligi kerak`;
    }
    return null;
  };

  const labelElm = label && (
    <FormLabel className="my-3 flex items-center gap-1">
      {label} {required && <span className="text-red-600">*</span>}
    </FormLabel>
  );

  return name && control ? (
    <FormField<TFieldValues, FieldPath<TFieldValues>>
      control={control}
      name={name}
      rules={{
        ...rules,
        validate: (value) => {
          if (required && !value) return "Rasm yuklash majburiy";
          if (value instanceof File) {
            return validateFile(value) || true;
          }
          if (multiple && Array.isArray(value)) {
            for (const file of value) {
              const error = validateFile(file);
              if (error) return error;
            }
          }
          return true;
        },
      }}
      render={({ field }) => {
        const files = multiple
          ? (field.value as File[] | null) || []
          : field.value
          ? [field.value as File]
          : [];

        // Agar File bo‘lsa → preview yarat
        const currentFile =
          !multiple && field.value instanceof File ? field.value : null;
        const currentPreview = currentFile
          ? URL.createObjectURL(currentFile)
          : null;

        // Joriy rasm (update rejimida)
        const initialImage =
          field.value && typeof field.value === "string" ? field.value : null;

        return (
          <FormItem>
            {labelElm}
            <FormControl>
              <div className="space-y-4">
                {/* Upload Area */}
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 transition-all",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (disabled) return;

                    const droppedFiles = Array.from(e.dataTransfer.files);
                    if (droppedFiles.length === 0) return;

                    if (!multiple) {
                      field.onChange(droppedFiles[0]);
                    } else {
                      field.onChange(droppedFiles);
                    }
                  }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const selected = e.target.files;
                      if (!selected || selected.length === 0) {
                        return; // Cancel → hech narsa qilma
                      }

                      if (!multiple) {
                        field.onChange(selected[0]);
                      } else {
                        field.onChange(Array.from(selected));
                      }
                    }}
                    disabled={disabled}
                  />

                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <Upload
                      className={cn(
                        "w-10 h-10",
                        dragActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <p className="text-sm text-muted-foreground">
                      {t(placeholder)}
                    </p>
                    {maxSize && (
                      <p className="text-xs text-muted-foreground">
                        {t("Maksimal")}: {formatFileSize(maxSize * 1024)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Joriy rasm (update rejimida) */}
                {initialImage && !currentFile && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden border">
                        <img
                          src={initialImage}
                          alt={t("Current image")}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t("Current image")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("Already uploaded")}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => field.onChange(null)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Yangi tanlangan rasm (preview) */}
                {currentPreview && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden border">
                        <img
                          src={currentPreview}
                          alt="Tanlangan rasm"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-xs">
                          {currentFile?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentFile && formatFileSize(currentFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        field.onChange(null);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
      <div className="text-sm text-muted-foreground">{placeholder}</div>
      <FormDescription>{helperText}</FormDescription>
    </div>
  );
};

export default MyFileInput;
