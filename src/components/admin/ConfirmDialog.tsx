import { useEffect, useState, useCallback } from "react";
import { Icon } from "../site-shell";

type ConfirmOpts = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

let externalRequest: ((opts: ConfirmOpts) => Promise<boolean>) | null = null;

export function confirmDialog(opts: ConfirmOpts): Promise<boolean> {
  if (!externalRequest) return Promise.resolve(window.confirm(opts.title));
  return externalRequest(opts);
}

export function ConfirmDialogHost() {
  const [state, setState] = useState<
    (ConfirmOpts & { resolve: (v: boolean) => void }) | null
  >(null);

  const request = useCallback((opts: ConfirmOpts) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...opts, resolve });
    });
  }, []);

  useEffect(() => {
    externalRequest = request;
    return () => {
      externalRequest = null;
    };
  }, [request]);

  useEffect(() => {
    if (!state) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function close(result: boolean) {
    if (!state) return;
    state.resolve(result);
    setState(null);
  }

  if (!state) return null;

  return (
    <div
      className="admin-scope fixed inset-0 z-[100] grid place-items-center p-4"
      style={{ background: "rgba(8,24,44,0.55)", backdropFilter: "blur(2px)" }}
      role="dialog"
      aria-modal="true"
      onClick={() => close(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          boxShadow: "var(--admin-shadow-3)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="h-11 w-11 rounded-xl grid place-items-center shrink-0"
            style={
              state.destructive
                ? { background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }
                : { background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }
            }
          >
            <Icon name={state.destructive ? "warning" : "help"} className="text-[22px]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold" style={{ color: "var(--admin-text)" }}>
              {state.title}
            </h3>
            {state.description && (
              <p className="mt-1 text-[13px]" style={{ color: "var(--admin-text-2)" }}>
                {state.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => close(false)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            {state.cancelLabel ?? "İptal"}
          </button>
          <button
            onClick={() => close(true)}
            className={
              state.destructive
                ? "admin-btn admin-btn-danger admin-btn-sm"
                : "admin-btn admin-btn-primary admin-btn-sm"
            }
          >
            {state.confirmLabel ?? "Onayla"}
          </button>
        </div>
      </div>
    </div>
  );
}