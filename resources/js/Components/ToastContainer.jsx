import React, { useState, useEffect, useCallback } from "react";
import { Toast } from "./Toast";

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    useEffect(() => {
        // Define the showToast function
        const showToast = (message, type = "info") => {
            const id = Date.now() + Math.random(); // Ensure unique IDs
            setToasts((prev) => [...prev, { id, message, type }]);

            // Optional: Limit the number of toasts
            // if (prev.length > 5) {
            //     return prev.slice(-5);
            // }
        };

        // Attach to window
        window.showToast = showToast;

        // Clean up
        return () => {
            delete window.showToast;
        };
    }, []);

    return (
        <div className="fixed top-10 right-4 z-50 space-y-2 w-80 max-w-full pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={3000}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};
