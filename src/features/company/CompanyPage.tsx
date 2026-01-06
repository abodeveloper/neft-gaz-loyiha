"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/shared/components/atoms/error-message/ErrorMessage";
import ImageGallery from "@/shared/components/atoms/image-gallery/ImageGallery";
import {
  RiBuilding4Line,
  RiEdit2Line,
  RiFacebookCircleFill,
  RiGlobalLine,
  RiInstagramLine,
  RiLinkedinBoxFill,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiTelegramLine,
  RiYoutubeFill,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCompanyData } from "./api/company";

export default function CompanyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company"],
    queryFn: () => getCompanyData(),
  });

  if (isLoading) return <CompanySkeleton />;

  if (isError || !data)
    return (
      <ErrorMessage
        title={t("Failed to load page")}
        message={t("An error occurred. Please try again later.")}
      />
    );

  return (
    <div className="space-y-6 container mx-auto p-0 pb-10">
      {/* 1. Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {t("Company Profile")}
          </h1>
          {/* <p className="text-muted-foreground text-sm">
            {t("View and manage organization details")}
          </p> */}
        </div>
        <Button onClick={() => navigate(`update`)} className="gap-2">
          <RiEdit2Line className="h-4 w-4" /> {t("Update")}
        </Button>
      </div>

      {/* 2. Statistics Row (Admin panellarda statistika odatda tepada turadi) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t("Statistic 1")} value={data.stat_1} />
        <StatCard label={t("Statistic 2")} value={data.stat_2} />
        <StatCard label={t("Statistic 3")} value={data.stat_3} />
        <StatCard label={t("Statistic 4")} value={data.stat_4} />
      </div>

      {/* 3. Main Organization Info (Full Width) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <RiBuilding4Line className="h-5 w-5 text-primary" />
            {t("Organization Details")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo Column */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="h-40 w-40 rounded-xl border border-dashed bg-muted/30 flex items-center justify-center p-2">
                {data.logo ? (
                  <>
                    <ImageGallery images={[data.logo]} />
                  </>
                ) : (
                  <span className="text-muted-foreground text-xs">{t("No Logo")}</span>
                )}
              </div>
            </div>

            {/* Names & Addresses Grid */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* UZ */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/10 border">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
                    UZ
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">
                    {data.name_uz}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-start gap-1 mt-2">
                    <RiMapPinLine className="h-3 w-3 mt-0.5 shrink-0" />
                    {data.address_uz}
                  </p>
                </div>
              </div>

              {/* RU */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/10 border">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
                    RU
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">
                    {data.name_ru}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-start gap-1 mt-2">
                    <RiMapPinLine className="h-3 w-3 mt-0.5 shrink-0" />
                    {data.address_ru}
                  </p>
                </div>
              </div>

              {/* EN */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/10 border">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
                    EN
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight">
                    {data.name_en}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-start gap-1 mt-2">
                    <RiMapPinLine className="h-3 w-3 mt-0.5 shrink-0" />
                    {data.address_en}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Contact & Socials (Grid Layout tagma-tak) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RiPhoneLine className="h-5 w-5 text-primary" />{" "}
              {t("Contact Information")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <RiPhoneLine className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t("Phone Number")}</span>
              </div>
              <a
                href={`tel:${data.phone_number}`}
                className="text-sm font-bold hover:underline"
              >
                {data.phone_number}
              </a>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <RiMailLine className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">
                  {t("Email Address")}
                </span>
              </div>
              <a
                href={`mailto:${data.email}`}
                className="text-sm font-bold hover:underline"
              >
                {data.email}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RiGlobalLine className="h-5 w-5 text-primary" />{" "}
              {t("Social Media")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <SocialButton
                href={data.telegram}
                icon={RiTelegramLine}
                label="Telegram"
              />
              <SocialButton
                href={data.instagram}
                icon={RiInstagramLine}
                label="Instagram"
              />
              <SocialButton
                href={data.facebook}
                icon={RiFacebookCircleFill}
                label="Facebook"
              />
              <SocialButton
                href={data.youtube}
                icon={RiYoutubeFill}
                label="YouTube"
              />
              <SocialButton
                href={data.linkedin}
                icon={RiLinkedinBoxFill}
                label="LinkedIn"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Kichik Komponentlar ---

// Statistika kartochkasi
const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Card>
    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-1">
      <span className="text-3xl font-bold text-primary">{value}</span>
      <span className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
        {label}
      </span>
    </CardContent>
  </Card>
);

// Social tugmacha
const SocialButton = ({
  href,
  icon: Icon,
  label,
}: {
  href?: string;
  icon: any;
  label: string;
}) => {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" className="gap-2">
        <Icon className="h-4 w-4 text-blue-600" />
        {label}
      </Button>
    </a>
  );
};

// Skeleton
const CompanySkeleton = () => (
  <div className="space-y-6 container mx-auto">
    <div className="flex justify-between">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-64 rounded-xl" />
    <div className="grid grid-cols-2 gap-6">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  </div>
);
