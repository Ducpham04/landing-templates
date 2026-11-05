import { useState, type ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  /** Ảnh quan trọng (hero) → tải ngay, ưu tiên cao */
  priority?: boolean;
  /** Bề rộng hiển thị lớn nhất (px) để sinh srcset cho ảnh Unsplash */
  maxWidth?: number;
};

const WIDTHS = [480, 768, 1080, 1440, 1920];

/** Ảnh responsive: srcset tự động cho Unsplash, lazy-load, nền dự phòng khi ảnh lỗi. */
export function SmartImage({ src, priority, maxWidth = 1920, className = "", alt = "", sizes, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const isUnsplash = src.includes("images.unsplash.com");
  const build = (w: number) => {
    const u = new URL(src);
    u.searchParams.set("w", String(w));
    u.searchParams.set("q", u.searchParams.get("q") ?? "72");
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    return u.toString();
  };
  const widths = WIDTHS.filter((w) => w <= maxWidth);
  if (failed) {
    return <div role="img" aria-label={alt} className={`img-fallback ${className}`} />;
  }
  return (
    <img
      src={isUnsplash ? build(Math.min(1440, maxWidth)) : src}
      srcSet={isUnsplash ? widths.map((w) => `${build(w)} ${w}w`).join(", ") : undefined}
      sizes={sizes ?? "100vw"}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
