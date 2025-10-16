import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { useNewForm } from "../hooks/useNewForm";
import { NewsType } from "../types";
import { Label } from "@/components/ui/label";

interface NewsFormProps {
  mode: "create" | "update";
  id?: number;
  initialData?: any;
}

const NewsForm = ({ mode, id, initialData }: NewsFormProps) => {
  const { form, onSubmit, mutation } = useNewForm({ mode, id, initialData });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">
        {mode === "create" ? "Yangilik yaratish" : "Yangilikni yangilash"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Sarlavha (O‘zbekcha)</Label>
          <Controller
            name="title_uz"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="O‘zbekcha sarlavha" />
            )}
          />
          {errors.title_uz && (
            <p className="text-red-500 text-sm">{errors.title_uz.message}</p>
          )}
        </div>
        <div>
          <Label>Sarlavha (Ruscha)</Label>
          <Controller
            name="title_ru"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Ruscha sarlavha" />
            )}
          />
          {errors.title_ru && (
            <p className="text-red-500 text-sm">{errors.title_ru.message}</p>
          )}
        </div>
        <div>
          <Label>Sarlavha (Inglizcha)</Label>
          <Controller
            name="title_en"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Inglizcha sarlavha" />
            )}
          />
          {errors.title_en && (
            <p className="text-red-500 text-sm">{errors.title_en.message}</p>
          )}
        </div>
        <div>
          <Label>Tavsif (O‘zbekcha)</Label>
          <Controller
            name="description_uz"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="O‘zbekcha tavsif" />
            )}
          />
          {errors.description_uz && (
            <p className="text-red-500 text-sm">
              {errors.description_uz.message}
            </p>
          )}
        </div>
        <div>
          <Label>Tavsif (Ruscha)</Label>
          <Controller
            name="description_ru"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Ruscha tavsif" />
            )}
          />
          {errors.description_ru && (
            <p className="text-red-500 text-sm">
              {errors.description_ru.message}
            </p>
          )}
        </div>
        <div>
          <Label>Tavsif (Inglizcha)</Label>
          <Controller
            name="description_en"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Inglizcha tavsif" />
            )}
          />
          {errors.description_en && (
            <p className="text-red-500 text-sm">
              {errors.description_en.message}
            </p>
          )}
        </div>
        <div>
          <Label>Turi</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Turini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NewsType.NEWS}>Yangilik</SelectItem>
                  <SelectItem value={NewsType.ANNOUNCEMENT}>E'lon</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>
        <div>
          <Label>Holati</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Faol</SelectItem>
                  <SelectItem value="false">Faol emas</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>
        <div>
          <Label>Rasm</Label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  console.log("Tanlangan fayl:", file); // Debugging
                  field.onChange(file);
                }}
              />
            )}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
          {initialData?.image && typeof initialData.image === "string" && (
            <div className="mt-2">
              <Label>Joriy rasm</Label>
              <img
                src={initialData.image}
                alt="Joriy yangilik rasmi"
                className="h-20 w-20 object-cover"
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? `${mode === "create" ? "Yaratilmoqda..." : "Yangilanmoqda..."}`
            : mode === "create"
            ? "Yaratish"
            : "Yangilash"}
        </Button>
      </form>
    </div>
  );
};

export default NewsForm;
