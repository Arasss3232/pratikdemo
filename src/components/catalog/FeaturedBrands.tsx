import { FEATURED_LOGOS } from "../../data/catalog";

export function FeaturedBrands() {
  return (
    <section
      className="bg-surface-container py-20 border-y border-outline-variant"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 400px" }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <h3 className="font-headline-lg text-headline-lg font-bold text-center text-on-background mb-8">
          Kategoride Öne Çıkan Markalar
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
          {FEATURED_LOGOS.map((src, i) => (
            <img
              key={src}
              alt="Featured brand logo"
              className={`h-8 md:h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 ${
                i === 4 ? "hidden lg:block" : ""
              }`}
              src={src}
              width={160}
              height={48}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
