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
  FileAudio,
  FileIcon,
  FileText,
  FileVideo,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Backenddan keladigan eski fayl tuzilishi
export interface ExistingFile {
  id: number;
  image: string;
}

// Komponent propslari
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

// Yordamchi type: Fayl, String (url) yoki Backend Obyekti bo'lishi mumkin
type FileItem = File | string | ExistingFile;

const MyFileInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  accept = "*",
  multiple = false,
  maxSize = 10240, // 10MB default
  required = false,
  disabled = false,
}: MyFileInputProps<TFieldValues>) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // URL sozlamalari (.env faylga qarab o'zgartiring)
  const API_URL = import.meta.env.VITE_API_URL || "";
  // Agar backend to'liq URL bermasa, base url ni qo'shish uchun:
  const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || API_URL;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024) {
      return `${t("Fayl hajmi cheklovdan oshdi")}: ${formatFileSize(
        maxSize * 1024
      )}`;
    }
    return null;
  };

  const isImageFile = (item: FileItem) => {
    if (item instanceof File) return item.type.startsWith("image/");
    const url =
      typeof item === "string" ? item : (item as ExistingFile)?.image || "";
    return /\.(jpe?g|png|gif|webp|svg|bmp)$/i.test(url);
  };

  const getPreviewUrl = (item: FileItem) => {
    if (item instanceof File) {
      return isImageFile(item) ? URL.createObjectURL(item) : null;
    }

    // String yoki Object dan URL ni ajratib olish
    let url = typeof item === "string" ? item : (item as ExistingFile)?.image;

    if (!url) return null;

    // Agar to'liq http bo'lsa o'zi, bo'lmasa domen qo'shamiz
    if (url.startsWith("http") || url.startsWith("blob")) {
      return url;
    }
    // URL boshidagi slashlarni tozalash
    return `${UPLOADS_URL}/${url.replace(/^\/+/, "")}`;
  };

  const getFileName = (item: FileItem) => {
    if (item instanceof File) return item.name;
    const url =
      typeof item === "string" ? item : (item as ExistingFile)?.image || "";
    // URL dan fayl nomini qirqib olish
    return url.split("/").pop()?.split("?")[0] || "file";
  };

  const getFileIcon = (item: FileItem) => {
    if (isImageFile(item)) return <ImageIcon className="w-6 h-6" />;

    // Agar File bo'lsa type orqali aniqlaymiz
    if (item instanceof File) {
      if (item.type.startsWith("video/"))
        return <FileVideo className="w-6 h-6" />;
      if (item.type.startsWith("audio/"))
        return <FileAudio className="w-6 h-6" />;
      if (item.type.includes("pdf")) return <FileText className="w-6 h-6" />;
    }

    // Agar URL bo'lsa kengaytma orqali taxmin qilamiz
    const name = getFileName(item).toLowerCase();
    if (name.endsWith(".pdf")) return <FileText className="w-6 h-6" />;
    if (name.match(/\.(mp4|mov|avi)$/))
      return <FileVideo className="w-6 h-6" />;

    return <FileIcon className="w-6 h-6" />;
  };

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          // 1. Required tekshiruvi
          if (required) {
            const isEmpty =
              !value || (Array.isArray(value) && value.length === 0);
            if (isEmpty) return t("Fayl yuklash majburiy");
          }

          // 2. Hajm tekshiruvi (faqat yangi File lar uchun)
          if (Array.isArray(value)) {
            for (const item of value) {
              if (item instanceof File) {
                const error = validateFile(item);
                if (error) return error;
              }
            }
          } else if (value instanceof File) {
            const error = validateFile(value);
            if (error) return error;
          }

          return true;
        },
      }}
      render={({ field }) => {
        // Qiymatni massivga aylantiramiz
        let items: FileItem[] = [];

        if (Array.isArray(field.value)) {
          items = field.value;
        } else if (field.value) {
          items = [field.value];
        }

        const handleAddFiles = (newFiles: File[]) => {
          if (multiple) {
            // Eskilar + Yangilar
            field.onChange([...items, ...newFiles]);
          } else {
            // Faqat yangisi (bittalik rejimda)
            field.onChange(newFiles[0]);
          }
        };

        const handleRemoveItem = (indexToRemove: number) => {
          const updatedItems = items.filter(
            (_, index) => index !== indexToRemove
          );

          if (multiple) {
            field.onChange(updatedItems);
          } else {
            field.onChange(null);
          }

          // Input value reset
          if (inputRef.current) inputRef.current.value = "";
        };

        return (
          <FormItem className="space-y-2">
            {label && (
              <FormLabel className="flex items-center gap-1">
                {label} {required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div className="space-y-4">
                {/* --- UPLOAD AREA --- */}
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 transition-all text-center flex flex-col items-center justify-center gap-2",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50",
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
                    handleAddFiles(Array.from(e.dataTransfer.files));
                  }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        handleAddFiles(Array.from(e.target.files));
                        e.target.value = ""; // Reset input
                      }
                    }}
                  />

                  <div className="p-3 bg-muted rounded-full">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary/60">
                      {t("Click to upload or drop file here")}
                    </span>
                  </div>
                  {maxSize > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("Maximum file size")}: {formatFileSize(maxSize * 1024)}
                    </p>
                  )}
                </div>

                {/* --- FILE LIST --- */}
                {items.length > 0 && (
                  <div className="grid gap-2">
                    {items.map((item, index) => {
                      const isNewFile = item instanceof File;
                      const previewUrl = getPreviewUrl(item);
                      const fileName = getFileName(item);
                      const isImg = isImageFile(item);

                      return (
                        <div
                          key={index}
                          className="relative flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors group"
                        >
                          {/* Preview / Icon */}
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center border shrink-0">
                            {isImg && previewUrl ? (
                              <img
                                src={previewUrl}
                                alt={fileName}
                                className="h-full w-full object-cover"
                                onLoad={() => {
                                  // Xotirani tozalash faqat blob url uchun
                                  if (
                                    isNewFile &&
                                    previewUrl.startsWith("blob:")
                                  ) {
                                    // React strict mode da darrov revoke qilmang, bu shart emas
                                  }
                                }}
                              />
                            ) : (
                              getFileIcon(item)
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              title={fileName}
                            >
                              {fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isNewFile
                                ? formatFileSize(item.size)
                                : t("File on the server")}
                            </p>
                          </div>

                          {/* Delete Button */}
                          {!disabled && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <X className="h-4 w-4" />
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
