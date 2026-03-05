import React, { useEffect, useState } from "react";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaInfoCircle,
    FaTimes,
} from "react-icons/fa";

export const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Animate in after mount
        const enterTimer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        // Set timer to start exit animation
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration);

        // Clean up timers
        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
        };
    }, [duration]);

    useEffect(() => {
        // Call onClose after exit animation completes
        if (isExiting) {
            const timer = setTimeout(() => {
                onClose();
            }, 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isExiting, onClose]);

    const icons = {
        success: (
            <FaCheckCircle className="text-green-500 dark:text-green-400 text-xl" />
        ),
        error: (
            <FaExclamationCircle className="text-red-500 dark:text-red-400 text-xl" />
        ),
        warning: (
            <FaExclamationCircle className="text-yellow-500 dark:text-yellow-400 text-xl" />
        ),
        info: (
            <FaInfoCircle className="text-blue-500 dark:text-blue-400 text-xl" />
        ),
    };

    const colors = {
        success:
            "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
        error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
        warning:
            "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
        info: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    };

    const textColors = {
        success: "text-green-800 dark:text-green-200",
        error: "text-red-800 dark:text-red-200",
        warning: "text-yellow-800 dark:text-yellow-200",
        info: "text-blue-800 dark:text-blue-200",
    };

    return (
        <div
            className={`flex items-center p-4 rounded-lg border shadow-lg transform transition-all duration-300 ${
                isVisible && !isExiting
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            } ${colors[type]}`}
            style={{
                transform:
                    isVisible && !isExiting
                        ? "translateX(0)"
                        : "translateX(100%)",
                opacity: isVisible && !isExiting ? 1 : 0,
            }}
        >
            <div className="flex-shrink-0 mr-3">{icons[type]}</div>
            <div className={`flex-1 ${textColors[type]}`}>{message}</div>
            <button
                onClick={() => setIsExiting(true)}
                className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
            >
                <FaTimes />
            </button>
        </div>
    );
};
