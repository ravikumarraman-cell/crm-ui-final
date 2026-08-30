import { useState, useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastEventDetail } from '../../lib/toast';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      if (!customEvent.detail) return;

      const { id, message, type, duration = 4000 } = customEvent.detail;
      const newToast: ToastItem = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('oneness-toast', handleToast);
    return () => {
      window.removeEventListener('oneness-toast', handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let iconColor = '#00a4bd';
          let borderLeftColor = '#00a4bd';
          let bgColor = '#ffffff';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            iconColor = '#10b981';
            borderLeftColor = '#10b981';
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            iconColor = '#f59e0b';
            borderLeftColor = '#f59e0b';
          } else if (toast.type === 'error') {
            Icon = XCircle;
            iconColor = '#ef4444';
            borderLeftColor = '#ef4444';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              layout
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: bgColor,
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${borderLeftColor}`,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                color: '#1e293b',
              }}
            >
              <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
              
              <div style={{ flex: 1, fontSize: '13px', fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'background-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
