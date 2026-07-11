import { PageHero } from "../marketing/PageHero";

export function CategoryHero({
  bgImage,
  title,
  description,
  crumb,
}: {
  bgImage: string;
  title: string;
  description: string;
  crumb: string;
}) {
  return (
    <PageHero
      title={title}
      description={description}
      bgImage={bgImage}
      breadcrumb={[
        { label: "Ana Sayfa", to: "/" },
        { label: "Ürünler", to: "/urunler" },
        { label: crumb },
      ]}
    />
  );
}
