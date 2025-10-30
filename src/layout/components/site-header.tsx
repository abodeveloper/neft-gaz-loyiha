import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

// Rasmlar
import RuLogo from "@/assets/lang-icon/ru.png";
import UkLogo from "@/assets/lang-icon/uk.png";
import UzLogo from "@/assets/lang-icon/uz.png";

// FlagIcon — <img> sifatida
const FlagIcon = ({ code }: { code: string }) => {
  const flags: Record<string, string> = {
    en: UkLogo,
    uz: UzLogo,
    ru: RuLogo,
  };

  const src = flags[code];
  if (!src) return null;

  return (
    <img
      src={src}
      alt={`${code} flag`}
      className="w-5 h-5 mr-2 object-contain rounded-sm"
    />
  );
};

export function SiteHeader() {
  const { t } = useTranslation();

  const languages = [
    { code: "en", label: "English" },
    { code: "uz", label: "O‘zbekcha" },
    { code: "ru", label: "Русский" }, // To‘g‘ri: label: "Русский"
  ];

  const handleLanguageChange = async (value: string) => {
    await i18n.changeLanguage(value);
  };

  const currentLang = languages.find(
    (l) => l.code === (i18n.resolvedLanguage || i18n.language)
  );

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-background border-b border-border-alpha-light transition-[width,height] ease-linear">
      <div className="flex items-center gap-2 px-4 w-full justify-between">
        {/* Chap taraf */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 scale-75" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h3 className="font-medium text-xl">
            {t("«Neft va gaz konlari geologiyasi hamda qidiruvi instituti»")}
          </h3>
        </div>

        {/* O‘ng taraf — Bayroq + Til */}
        <Select
          value={i18n.resolvedLanguage || i18n.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="w-36 h-9">
            <SelectValue>
              {currentLang && (
                <div className="flex items-center">
                  <FlagIcon code={currentLang.code} />
                  <span>{currentLang.label}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center">
                  <FlagIcon code={lang.code} />
                  <span>{lang.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
