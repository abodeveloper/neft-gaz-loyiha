// components/MyFileInput.tsx
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
import {
  Upload,
  X,
  FileIcon,
  Image,
  FileText,
  FileVideo,
  FileAudio,
} from "lucide-react";
import { useRef, useState } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type MyFileInputProps<TFieldValues extends FieldValues = FieldValues> = {
  control: any;
  name: FieldPath<TFieldValues>;
  label?: string;
  helperText?: string;
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // KB
  required?: boolean;
  disabled?: boolean;
};

const MyFileInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  placeholder = "Click or drag to upload file",
  accept = "*",
  multiple = false,
  maxSize = 10240, // 10MB
  required = false,
  disabled = false,
}: MyFileInputProps<TFieldValues>) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || `${API_URL}/`;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024) {
      return `${t("File size must not exceed")} ${formatFileSize(
        maxSize * 1024
      )}`;
    }
    return null;
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (type.startsWith("video/")) return <FileVideo className="w-6 h-6" />;
    if (type.startsWith("audio/")) return <FileAudio className="w-6 h-6" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-6 h-6" />;
    return <FileIcon className="w-6 h-6" />;
  };

  const isImageFile = (file: File | string) => {
    if (file instanceof File) return file.type.startsWith("image/");
    return /\.(jpe?g|png|gif|webp|svg)$/i.test(file);
  };

  const getPreviewUrl = (item: File | string) => {
    if (item instanceof File) {
      return isImageFile(item) ? URL.createObjectURL(item) : null;
    }
    const filename = typeof item === "string" ? item : "";
    return filename.startsWith("http")
      ? filename
      : `${UPLOADS_URL}${filename.replace(/^\/+/, "")}`;
  };

  const getFileName = (item: File | string) => {
    return item instanceof File ? item.name : item.split("/").pop() || "file";
  };

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          if (required) {
            if (multiple) {
              const hasFiles =
                Array.isArray(value) &&
                value.some((v) => v instanceof File || typeof v === "string");
              if (!hasFiles) return t("At least one file is required");
            } else {
              if (!value) return t("File is required");
            }
          }

          if (value instanceof File) {
            const error = validateFile(value);
            if (error) return error;
          }

          if (multiple && Array.isArray(value)) {
            for (const file of value) {
              if (file instanceof File) {
                const error = validateFile(file);
                if (error) return error;
              }
            }
          }
          return true;
        },
      }}
      render={({ field }) => {
        const value = field.value;

        // Qiymatni normalizatsiya qilamiz: string | File | (string|File)[]
        let items: (File | string)[] = [];

        if (multiple) {
          if (Array.isArray(value)) {
            items = value.filter(
              (item) => item instanceof File || typeof item === "string"
            );
          } else if (value) {
            items = [value];
          }
        } else {
          if (value instanceof File || typeof value === "string") {
            items = [value];
          }
        }

        const addFiles = (newFiles: File[]) => {
          if (multiple) {
            field.onChange([...items, ...newFiles]);
          } else if (newFiles[0]) {
            field.onChange(newFiles[0]);
          }
        };

        const removeItem = (index: number) => {
          const updated = items.filter((_, i) => i !== index);
          field.onChange(
            multiple ? (updated.length ? updated : []) : updated[0] || null
          );
          if (inputRef.current) inputRef.current.value = "";
        };

        return (
          <FormItem>
            {label && (
              <FormLabel className="my-3 flex items-center gap-1">
                {label} {required && <span className="text-red-600">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div className="space-y-4">
                {/* Upload Zone */}
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 transition-all text-center",
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
                    if (disabled || !e.dataTransfer.files.length) return;
                    addFiles(Array.from(e.dataTransfer.files));
                  }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        addFiles(Array.from(e.target.files));
                        e.target.value = "";
                      }
                    }}
                  />

                  <Upload
                    className={cn(
                      "w-12 h-12 mx-auto mb-3",
                      dragActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t(placeholder)}
                  </p>
                  {maxSize > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("Max size")}: {formatFileSize(maxSize * 1024)}
                    </p>
                  )}
                </div>

                {/* Fayllar roʻyxati */}
                {items.length > 0 && (
                  <div className="space-y-3">
                    {items.map((item, index) => {
                      const isUrl = typeof item === "string";
                      const fileName = getFileName(item);
                      const previewUrl = getPreviewUrl(item);
                      const isImg = isImageFile(item);

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded overflow-hidden border bg-background flex-shrink-0">
                              {isImg && previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt={fileName}
                                  className="w-full h-full object-cover"
                                  onLoad={() =>
                                    item instanceof File &&
                                    URL.revokeObjectURL(previewUrl)
                                  }
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {isUrl ? (
                                    <FileIcon className="w-8 h-8 text-muted-foreground" />
                                  ) : (
                                    getFileIcon(item as File)
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-xs">
                                {fileName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isUrl
                                  ? t("Already uploaded")
                                  : formatFileSize((item as File).size)}
                              </p>
                            </div>
                          </div>

                          {!disabled && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => removeItem(index)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </FormControl>

            {helperText && <FormDescription>{helperText}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default MyFileInput;
