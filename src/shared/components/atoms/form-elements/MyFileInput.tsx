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

// Global File klass
declare const File: typeof globalThis.File;

export type MyFileInputProps<TFieldValues extends FieldValues> = {
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
  maxSize = 10240,
  required = false,
  disabled = false,
}: MyFileInputProps<TFieldValues>) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || `${API_URL}`;

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
    if (type.startsWith("image/")) return <Image className="w-5 h-5" />;
    if (type.startsWith("video/")) return <FileVideo className="w-5 h-5" />;
    if (type.startsWith("audio/")) return <FileAudio className="w-5 h-5" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  const labelElm = label && (
    <FormLabel className="my-3 flex items-center gap-1">
      {label} {required && <span className="text-red-600">*</span>}
    </FormLabel>
  );

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          if (required && !value) return t("File upload is required");
          if (value instanceof File) {
            return validateFile(value) || true;
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
        // Har safar to‘g‘ri normalizatsiya
        const currentValue = field.value;

        let currentFile: File | null = null;
        let currentUrl: string | null = null;
        let fileList: File[] = [];
        let urlList: string[] = [];

        if (multiple) {
          if (Array.isArray(currentValue)) {
            currentValue.forEach((item) => {
              if (item instanceof File) fileList.push(item);
              else if (typeof item === "string") urlList.push(item);
            });
          }
        } else {
          if (currentValue instanceof File) {
            currentFile = currentValue;
          } else if (typeof currentValue === "string") {
            currentUrl = currentValue;
          }
        }

        const getFileUrl = (filename: string) =>
          filename.startsWith("http")
            ? filename
            : `${UPLOADS_URL}/${filename.replace(/^\/+/, "")}`;

        const handleFileAdd = (newFiles: File[]) => {
          if (multiple) {
            const updated = [...fileList, ...newFiles];
            field.onChange(updated);
          } else {
            const first = newFiles[0];
            if (first) {
              field.onChange(first); // Bitta fayl
            }
          }
        };

        const handleRemove = () => {
          field.onChange(multiple ? [] : null);
          if (inputRef.current) inputRef.current.value = "";
        };

        return (
          <FormItem>
            {labelElm}
            <FormControl>
              <div className="space-y-4">
                {/* Upload Zone */}
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

                    const dropped = Array.from(e.dataTransfer.files);
                    if (dropped.length === 0) return;

                    handleFileAdd(dropped);
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
                      if (!selected || selected.length === 0) return;

                      const newFileList = Array.from(selected);
                      handleFileAdd(newFileList);
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
                    {maxSize > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {t("Max")}: {formatFileSize(maxSize * 1024)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fayllar ro‘yxati */}
                <div className="space-y-2">
                  {/* Backend URL */}
                  {(multiple ? urlList : currentUrl ? [currentUrl] : []).map(
                    (u, index) => {
                      const fileName = u.split("/").pop() || u;
                      const isImg = /\.(jpe?g|png|gif|webp|svg)$/i.test(
                        fileName
                      );

                      return (
                        <div
                          key={`url-${index}`}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded overflow-hidden border bg-background flex items-center justify-center">
                              {isImg ? (
                                <img
                                  src={getFileUrl(u)}
                                  alt={fileName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FileIcon className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs">
                                {fileName}
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
                            onClick={handleRemove}
                            disabled={disabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    }
                  )}

                  {/* Yangi fayl */}
                  {(multiple ? fileList : currentFile ? [currentFile] : []).map(
                    (f, index) => {
                      const preview = isImage(f)
                        ? URL.createObjectURL(f)
                        : null;

                      return (
                        <div
                          key={`file-${index}`}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded overflow-hidden border bg-background flex items-center justify-center">
                              {preview ? (
                                <img
                                  src={preview}
                                  alt={f.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                getFileIcon(f)
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs">
                                {f.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(f.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleRemove}
                            disabled={disabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </FormControl>
            <FormDescription>{helperText}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default MyFileInput;
