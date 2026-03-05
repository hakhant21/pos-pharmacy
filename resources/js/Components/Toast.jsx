import React, { useEffect, useState } from "react";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaInfoCircle,
    FaTimes,
} from "react-icons/fa";

export const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <FaCheckCircle className="text-green-500 text-xl" />,
        error: <FaExclamationCircle className="text-red-500 text-xl" />,
        warning: <FaExclamationCircle className="text-yellow-500 text-xl" />,
        info: <FaInfoCircle className="text-blue-500 text-xl" />,
    };

    const colors = {
        success:
            "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        warning:
            "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    };

    const textColors = {
        success: "text-green-800 dark:text-green-200",
        error: "text-red-800 dark:text-red-200",
        warning: "text-yellow-800 dark:text-yellow-200",
        info: "text-blue-800 dark:text-blue-200",
    };

    return (
        <div
            className={`flex items-center p-4 mb-2 rounded-lg border shadow-lg transform transition-all duration-300 ${
                isVisible ? "translate-x-0" : "translate-x-full"
            } ${colors[type]}`}
        >
            <div className="flex-shrink-0 mr-3">{icons[type]}</div>
            <div className={`flex-1 ${textColors[type]}`}>{message}</div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
                <FaTimes />
            </button>
        </div>
    );
};
