import { useEffect, useState, useCallback } from "react";
import { Icon } from "../site-shell";
import { buttonStyles } from "../../lib/button-styles";

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
      className="fixed inset-0 z-[100] bg-black/50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => close(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-lg max-w-md w-full p-6 shadow-xl flex flex-col gap-4"
      >
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 rounded-full grid place-items-center shrink-0 ${
              state.destructive ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
            }`}
          >
            <Icon name={state.destructive ? "warning" : "help"} className="text-[22px]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-label-bold text-body-md">{state.title}</h3>
            {state.description && (
              <p className="mt-1 text-body-sm text-on-surface-variant">{state.description}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => close(false)}
            className={buttonStyles({ variant: "outline-dark", size: "sm" })}
          >
            {state.cancelLabel ?? "İptal"}
          </button>
          <button
            onClick={() => close(true)}
            className={
              state.destructive
                ? "inline-flex items-center gap-1 h-9 px-4 rounded-md bg-error text-on-error text-body-sm font-label-bold hover:opacity-90"
                : buttonStyles({ variant: "primary", size: "sm" })
            }
          >
            {state.confirmLabel ?? "Onayla"}
          </button>
        </div>
      </div>
    </div>
  );
}