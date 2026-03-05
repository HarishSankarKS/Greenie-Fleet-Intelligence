import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { AlertCircle, X, Info, CheckCircle2 } from 'lucide-react';

const ToastManager = () => {
    const { notifications, removeNotification } = useStore();

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            {notifications.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeNotification(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (toast.type) {
            case 'error': return <AlertCircle className="text-rose-500" />;
            case 'success': return <CheckCircle2 className="text-emerald-500" />;
            case 'warning': return <AlertCircle className="text-amber-500" />;
            default: return <Info className="text-blue-500" />;
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-700 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 w-80 animate-in slide-in-from-top-4 slide-in-from-right-8 fade-in pointer-events-auto">
            {getIcon()}
            <div className="flex-1">
                <h4 className="font-bold text-sm mb-0.5">{toast.title}</h4>
                <p className="text-xs text-slate-400">{toast.message}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export default ToastManager;
