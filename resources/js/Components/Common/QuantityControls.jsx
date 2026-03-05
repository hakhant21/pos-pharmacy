import { FaMinus, FaPlus } from "react-icons/fa";

export const QuantityControls = ({
    quantity,
    available,
    onIncrease,
    onDecrease,
}) => {
    return (
        <div className="flex items-center space-x-1 lg:space-x-2">
            <button
                onClick={onDecrease}
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="Decrease quantity"
            >
                <FaMinus className="text-xs" />
            </button>
            <span className="w-8 lg:w-12 text-center font-medium text-gray-900 dark:text-gray-100">
                {quantity}
            </span>
            <button
                onClick={onIncrease}
                className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity >= available}
                aria-label="Increase quantity"
            >
                <FaPlus className="text-xs" />
            </button>
        </div>
    );
};
