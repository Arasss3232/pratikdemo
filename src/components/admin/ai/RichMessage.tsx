import { Icon } from "@/components/site-shell";

// Lightweight markdown-ish renderer: ### headings, **bold**, - bullets, blank-line paragraphs.
// Deliberately tiny — the assistant is prompted to stay simple.
function renderInline(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={`${keyPrefix}-b-${i++}`}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function RichText({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let paraBuffer: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (!bulletBuffer.length) return;
    blocks.push(
      <ul key={`ul-${key++}`} className="list-disc pl-5 space-y-1 my-1.5">
        {bulletBuffer.map((b, i) => (
          <li key={i}>{renderInline(b, `li-${key}-${i}`)}</li>
        ))}
      </ul>,
    );
    bulletBuffer = [];
  };
  const flushPara = () => {
    if (!paraBuffer.length) return;
    const joined = paraBuffer.join(" ");
    blocks.push(<p key={`p-${key++}`} className="my-1.5">{renderInline(joined, `p-${key}`)}</p>);
    paraBuffer = [];
  };

  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flushBullets(); flushPara(); continue; }
    if (l.startsWith("### ")) {
      flushBullets(); flushPara();
      blocks.push(
        <h4 key={`h-${key++}`} className="font-semibold text-[13.5px] mt-2 mb-1" style={{ color: "var(--admin-navy)" }}>
          {renderInline(l.slice(4), `h-${key}`)}
        </h4>,
      );
      continue;
    }
    if (l.startsWith("- ") || l.startsWith("• ")) {
      flushPara();
      bulletBuffer.push(l.slice(2));
      continue;
    }
    paraBuffer.push(l);
  }
  flushBullets(); flushPara();
  return <div className="text-[13.5px] leading-relaxed">{blocks}</div>;
}

const TYPE_META: Record<string, { label: string; icon: string }> = {
  info: { label: "Bilgilendirme", icon: "info" },
  recommendation: { label: "Tavsiye", icon: "lightbulb" },
  options: { label: "Seçenekler", icon: "tune" },
  content_draft: { label: "İçerik Taslağı", icon: "edit_note" },
  design: { label: "Tasarım Önerisi", icon: "palette" },
  audit: { label: "Kontrol Sonucu", icon: "fact_check" },
  warning: { label: "Uyarı", icon: "warning" },
  clarify: { label: "Netleştirme", icon: "help" },
  proposal: { label: "Değişiklik Önerisi", icon: "auto_fix_high" },
};

const CONF_META: Record<string, { label: string; color: string }> = {
  low: { label: "düşük güven", color: "#b45309" },
  medium: { label: "orta güven", color: "#0f766e" },
  high: { label: "yüksek güven", color: "#065f46" },
};

export function ResponseTypePill({ type, confidence }: { type?: string; confidence?: string }) {
  const t = type && TYPE_META[type];
  const c = confidence && CONF_META[confidence];
  if (!t && !c) return null;
  return (
    <div className="flex items-center gap-1.5 mb-1.5 text-[10.5px] uppercase tracking-wide font-semibold">
      {t && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
          style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
        >
          <Icon name={t.icon} className="text-[13px]" />
          {t.label}
        </span>
      )}
      {c && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded" style={{ background: "#f1f5f9", color: c.color }}>
          {c.label}
        </span>
      )}
    </div>
  );
}

export type OptionCard = {
  name: string;
  description: string;
  advantage: string;
  tradeoff: string;
  use_case: string;
};

export function OptionsGrid({
  options,
  onSelect,
}: {
  options: OptionCard[];
  onSelect: (o: OptionCard, index: number) => void;
}) {
  return (
    <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {options.map((o, i) => (
        <div
          key={i}
          className="rounded-lg p-2.5 flex flex-col gap-1.5"
          style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-5 w-5 rounded grid place-items-center text-[11px] font-bold" style={{ background: "var(--admin-navy)", color: "var(--admin-yellow)" }}>
              {i + 1}
            </span>
            <div className="font-semibold text-[13px]" style={{ color: "var(--admin-text)" }}>{o.name}</div>
          </div>
          {o.description && (
            <div className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>{o.description}</div>
          )}
          <div className="text-[11.5px] space-y-0.5 mt-1">
            {o.advantage && <div><span className="font-semibold" style={{ color: "var(--admin-navy)" }}>Avantaj:</span> <span style={{ color: "var(--admin-text-2)" }}>{o.advantage}</span></div>}
            {o.tradeoff && <div><span className="font-semibold" style={{ color: "#b45309" }}>Dikkat:</span> <span style={{ color: "var(--admin-text-2)" }}>{o.tradeoff}</span></div>}
            {o.use_case && <div><span className="font-semibold" style={{ color: "var(--admin-text-mute)" }}>Uygun:</span> <span style={{ color: "var(--admin-text-2)" }}>{o.use_case}</span></div>}
          </div>
          <button
            onClick={() => onSelect(o, i)}
            className="admin-btn admin-btn-primary admin-btn-sm mt-1 justify-center"
          >
            <Icon name="check" className="text-[15px]" /> Bu seçeneği seç
          </button>
        </div>
      ))}
    </div>
  );
}

export function WarningsList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-2 rounded-lg p-2.5 text-[12px] space-y-1" style={{ background: "#fef3c7", border: "1px solid #fde68a", color: "#78350f" }}>
      {items.map((w, i) => (
        <div key={i} className="flex gap-1.5">
          <Icon name="warning" className="text-[15px] shrink-0" />
          <span>{w}</span>
        </div>
      ))}
    </div>
  );
}

export function ClarifyBlock({
  clarify,
  onChoose,
}: {
  clarify: { question: string; choices: string[] };
  onChoose: (choice: string) => void;
}) {
  return (
    <div className="mt-2 rounded-lg p-2.5" style={{ background: "var(--admin-bg)", border: "1px dashed var(--admin-border)" }}>
      <div className="text-[12.5px] font-semibold mb-1.5" style={{ color: "var(--admin-text)" }}>
        <Icon name="help" className="text-[14px] align-middle mr-1" style={{ color: "var(--admin-navy)" }} />
        {clarify.question}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {clarify.choices.map((c) => (
          <button
            key={c}
            onClick={() => onChoose(c)}
            className="text-[12px] rounded-full px-3 py-1 transition-colors"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FollowUps({
  items,
  onChoose,
}: {
  items: string[];
  onChoose: (label: string) => void;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((f) => (
        <button
          key={f}
          onClick={() => onChoose(f)}
          className="text-[12px] rounded-full px-3 py-1 transition-colors inline-flex items-center gap-1"
          style={{ background: "var(--admin-yellow-soft)", border: "1px solid var(--admin-border)", color: "var(--admin-navy)" }}
        >
          <Icon name="arrow_forward" className="text-[13px]" />
          {f}
        </button>
      ))}
    </div>
  );
}