export interface GalleryImage {
  src:  string;
  alt:  string;
  href?: string;   // optional link target
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex space-x-4 snap-x snap-mandatory">
        {images.map((img, i) => {
          const content = (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className="h-48 w-auto flex-shrink-0 rounded-lg object-cover snap-center"
            />
          );

          return img.href ? (
            <a key={i} href={img.href} className="flex-shrink-0">
              {content}
            </a>
          ) : (
            content
          );
        })}
      </div>
    </div>
  );
}