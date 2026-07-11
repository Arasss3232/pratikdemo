import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { BRAND_LOGOS, productSrcSet, type Product } from "../../data/catalog";
import { Icon } from "../site-shell";
import { buttonStyles } from "../../lib/button-styles";
import { addProductToQuoteCart } from "../../lib/quote-cart";

function ProductCardBase({ p, view = "grid" }: { p: Product; view?: "grid" | "list" }) {
  const isList = view === "list";

  return (
    <article
      className={`group bg-surface-container-lowest border border-outline-variant rounded hover:border-primary transition-colors duration-300 flex relative overflow-hidden ${
        isList ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded z-10 tracking-wider ${
          p.stock === "in"
            ? "bg-primary-container text-on-primary-container"
            : "bg-secondary text-on-secondary"
        }`}
      >
        {p.stock === "in" ? "Stokta" : "Sınırlı Stok"}
      </div>
      <div className="absolute top-2 left-2 bg-surface-container p-1 rounded z-10 border border-outline-variant">
        <img
          alt={p.brandAlt}
          className="h-4 object-contain"
          src={BRAND_LOGOS[p.brand]}
          width={64}
          height={16}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={`${isList ? "h-48 sm:h-auto sm:w-56" : "h-48"} bg-surface-container-low flex items-center justify-center p-4 relative flex-shrink-0`}>
        <img
          alt={p.productAlt}
          className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          src={p.productImg}
          srcSet={productSrcSet(p.productImg)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          width={400}
          height={192}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow border-t border-outline-variant">
        <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">
          SKU: {p.sku}
        </div>
        <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2 leading-tight group-hover:text-primary transition-colors">
          {p.name}
        </h3>
        <ul className="text-body-sm font-body-sm text-on-surface-variant mb-4 space-y-1">
          {p.specs.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <Icon name={s.icon} className="text-[14px] text-outline" />
              {s.label}
            </li>
          ))}
        </ul>
        <div className={`mt-auto pt-2 border-t border-outline-variant flex gap-2 ${isList ? "flex-col sm:flex-row" : "flex-col"}`}>
          <Link
            to="/urun-detay/$sku"
            params={{ sku: p.sku }}
            className={buttonStyles({ variant: "outline-dark", size: "sm", className: "w-full px-3" })}
            aria-label={`${p.name} detaylarını incele`}
          >
            <Icon name="visibility" className="text-[16px]" />
            Detayları İncele
          </Link>
          <Link
            to="/teklif-sepeti"
            onClick={() => addProductToQuoteCart(p)}
            className={buttonStyles({ variant: "primary", size: "sm", className: "w-full px-3" })}
            aria-label={`${p.name} için teklif al`}
          >
            <Icon name="request_quote" className="text-[16px]" />
            Teklif Al
          </Link>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
