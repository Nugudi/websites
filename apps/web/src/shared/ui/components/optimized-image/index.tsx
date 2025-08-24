import type { ImgHTMLAttributes } from "react";

interface ExtendedImgHTMLAttributes
  extends ImgHTMLAttributes<HTMLImageElement> {
  fetchPriority?: "high" | "low" | "auto";
}

interface OptimizedImageProps extends Omit<ExtendedImgHTMLAttributes, "src"> {
  /** 확장자 없는 이미지 경로 (예: "/images/level-2-nuguri") */
  src: string;
  /** 이미지 대체 텍스트 */
  alt: string;
  /**
   * 지원할 이미지 포맷 배열 (우선순위 순서)
   * @default ["avif", "png"]
   */
  formats?: string[];
  /**
   * 이미지 로딩 우선순위 (LCP 최적화)
   */
  priority?: "high" | "low";
}

const OptimizedImage = ({
  src,
  alt,
  formats = ["avif", "png"],
  priority,
  ...props
}: OptimizedImageProps) => {
  const fallbackFormat = formats[formats.length - 1];
  const sourceFormats = formats.slice(0, -1);

  const getPriorityProps = () => {
    if (priority === "high") {
      // LCP 이미지
      return {
        fetchPriority: "high" as const,
        loading: "eager" as const,
      };
    }

    if (priority === "low") {
      return {
        loading: "lazy" as const,
      };
    }

    return {};
  };

  const priorityProps = getPriorityProps();

  return (
    <picture>
      {sourceFormats.map((format) => (
        <source
          key={`${src}-${format}`}
          srcSet={`${src}.${format}`}
          type={`image/${format}`}
        />
      ))}
      <img
        src={`${src}.${fallbackFormat}`}
        alt={alt}
        {...props}
        {...priorityProps}
      />
    </picture>
  );
};

export default OptimizedImage;
