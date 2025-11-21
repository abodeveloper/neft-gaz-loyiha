import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lightgallery.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import LightGallery from "lightgallery/react";

// Eye icon
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

interface ImageGalleryProps {
  images: string[];
}

// ✅ Yordamchi funksiya — to‘liq URL ni shakllantiradi
const getFullUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  const baseUrl = import.meta.env.VITE_API_URL || "";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  const mainImage = getFullUrl(images[0]);

  return (
    <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
      {/* Asosiy rasm */}
      <a
        href={mainImage}
        className="inline-block group relative overflow-hidden rounded-md"
      >
        <img
          src={mainImage}
          className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <EyeIcon />
          </div>
        </div>

        {/* Agar ko‘proq rasm bo‘lsa */}
        {images.length > 1 && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
            +{images.length - 1}
          </div>
        )}
      </a>

      {/* Qolgan rasmlar yashirin */}
      {images.slice(1).map((imageUrl, index) => {
        const fullUrl = getFullUrl(imageUrl);
        return (
          <a key={index} href={fullUrl} style={{ display: "none" }}>
            <img src={fullUrl} alt="" />
          </a>
        );
      })}
    </LightGallery>
  );
};

export default ImageGallery;
