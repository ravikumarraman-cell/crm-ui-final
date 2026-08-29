import { useEffect, useState } from 'react';

export function GlobalExceptionReporter() {
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      setErrorNotice(event.message || 'An unexpected error occurred');
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrorNotice(String(event.reason || 'Unhandled promise rejection'));
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  if (!errorNotice) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center justify-between gap-3">
      <span>{errorNotice}</span>
      <button
        type="button"
        onClick={() => setErrorNotice(null)}
        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
      >
        Dismiss
      </button>
    </div>
  );
}

