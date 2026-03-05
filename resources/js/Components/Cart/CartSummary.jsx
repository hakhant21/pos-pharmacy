import { FaCreditCard } from "react-icons/fa";

export const CartSummary = ({ subtotal, total, onCheckout }) => (
    <div className="sticky bottom-0 md:relative bg-white dark:bg-gray-800 rounded-lg shadow-lg md:shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4 lg:space-x-8">
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Subtotal:
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {subtotal}
                    </span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4 lg:space-x-8">
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Total:
                    </span>
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {total}
                    </span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-base sm:text-lg flex items-center justify-center gap-2"
            >
                <FaCreditCard />
                Checkout
            </button>
        </div>
    </div>
);
