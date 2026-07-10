import { Link } from "@tanstack/react-router";
import { CTA_IMG } from "../../data/catalog";
import { Icon } from "../site-shell";

export function CategoryCta() {
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
      <div className="bg-primary rounded overflow-hidden flex flex-col md:flex-row relative">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), repeating-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)",
            backgroundPosition: "0 0, 10px 10px",
            backgroundSize: "20px 20px",
          }}
          aria-hidden
        />
        <div className="p-8 md:p-20 flex-1 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-on-primary/20 text-on-primary w-max px-3 py-1 rounded font-label-bold text-label-bold mb-4 uppercase tracking-wider">
            <Icon name="business_center" className="text-[16px]" /> Kurumsal Çözümler
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-primary mb-2 leading-tight">
            Özel projeniz için toplu teklif mi istiyorsunuz?
          </h2>
          <p className="font-body-lg text-body-lg text-primary-fixed mb-8 max-w-xl">
            Satın alma uzmanlarımız, proje ölçeğinize uygun özel fiyatlandırma ve teknik
            şartname desteği sağlamak için hazırdır.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/teklif"
              className="bg-secondary text-on-secondary px-8 py-3 rounded font-label-bold text-label-bold hover:brightness-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Toplu Teklif Formu
              <Icon name="arrow_forward" />
            </Link>
            <a
              href="tel:+905550000000"
              className="bg-transparent border-2 border-on-primary/30 text-on-primary px-8 py-3 rounded font-label-bold text-label-bold hover:border-on-primary transition-all flex items-center justify-center gap-2"
            >
              <Icon name="support_agent" />
              Bizi Arayın
            </a>
          </div>
        </div>
        <div className="hidden md:block w-1/3 relative z-10 bg-surface-variant border-l border-outline-variant/30">
          <img
            alt="Procurement officer reviewing tablet in warehouse"
            className="w-full h-full object-cover mix-blend-luminosity opacity-80"
            src={CTA_IMG}
            width={640}
            height={480}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
