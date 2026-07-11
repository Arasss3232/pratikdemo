import type { Product } from "../data/catalog";

export const QUOTE_CART_STORAGE_KEY = "pratik_quote_cart";

export type QuoteCartItem = Pick<
  Product,
  "brand" | "brandAlt" | "productAlt" | "productImg" | "sku" | "name" | "specs" | "stock"
> & {
  quantity: number;
  addedAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyQuoteCartChanged(items: QuoteCartItem[]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("quote-cart:changed", { detail: items }));
}

export function getQuoteCartItems(): QuoteCartItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(QUOTE_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setQuoteCartItems(items: QuoteCartItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(QUOTE_CART_STORAGE_KEY, JSON.stringify(items));
  notifyQuoteCartChanged(items);
}

export function addProductToQuoteCart(product: Product) {
  const items = getQuoteCartItems();
  const existing = items.find((item) => item.sku === product.sku);

  const nextItems = existing
    ? items.map((item) =>
        item.sku === product.sku ? { ...item, quantity: item.quantity + 1 } : item,
      )
    : [
        ...items,
        {
          brand: product.brand,
          brandAlt: product.brandAlt,
          productAlt: product.productAlt,
          productImg: product.productImg,
          sku: product.sku,
          name: product.name,
          specs: product.specs,
          stock: product.stock,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ];

  setQuoteCartItems(nextItems);
}

export function updateQuoteCartQuantity(sku: string, quantity: number) {
  const nextQuantity = Math.max(1, Math.min(99, quantity));
  const nextItems = getQuoteCartItems().map((item) =>
    item.sku === sku ? { ...item, quantity: nextQuantity } : item,
  );
  setQuoteCartItems(nextItems);
}

export function removeQuoteCartItem(sku: string) {
  setQuoteCartItems(getQuoteCartItems().filter((item) => item.sku !== sku));
}

export function clearQuoteCart() {
  setQuoteCartItems([]);
}