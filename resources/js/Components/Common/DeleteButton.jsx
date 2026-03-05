import { FaTrash } from "react-icons/fa";

export const DeleteButton = ({ onDelete, className = "" }) => (
    <button
        onClick={onDelete}
        className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg ${className}`}
        aria-label="Delete item"
    >
        <FaTrash />
    </button>
);
