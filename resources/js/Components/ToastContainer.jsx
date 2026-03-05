import React, { useState, useEffect } from "react";
import { Toast } from "./Toast";
export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        window.showToast = (message, type = "info") => {
            const id = Date.now();
            setToasts((prev) => [...prev, { id, message, type }]);
        };

        return () => {
            delete window.showToast;
        };
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2 w-80">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};
