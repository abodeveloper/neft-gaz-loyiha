import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiAddLine } from "@remixicon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MenuForm from "./MenuForm";

const CreateMenuModal = ({
  parentId,
  onSuccess,
}: {
  parentId?: string | number;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess(); // ✅ faqat mavjud bo‘lsa chaqiriladi
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <RiAddLine className="h-5 w-5" /> {t("Create")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("Create Menu")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <MenuForm
            mode="create"
            handleSuccess={handleSuccess}
            initialData={{ parent: parentId || null }}
            parentId={parentId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenuModal;
