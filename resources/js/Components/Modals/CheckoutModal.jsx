import { useState } from "react";
import Modal from "@/Components/Modal";

export const CheckoutModal = ({
    show,
    onClose,
    cart,
    total,
    onCheckout,
    isProcessing,
}) => {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onCheckout({ customerName, customerPhone, notes });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Complete Checkout
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Order Summary */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 mb-4">
                        <h3 className="font-medium mb-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            Order Summary
                        </h3>
                        {cart.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between text-xs sm:text-sm mb-2"
                            >
                                <div>
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {item.medicine_name} ({item.strength})
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500 block">
                                        x{item.quantity} @{" "}
                                        {item.unit_price_display}
                                    </span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {item.total_price_display}
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2 flex justify-between font-bold">
                            <span className="text-gray-700 dark:text-gray-300">
                                Total:
                            </span>
                            <span className="text-blue-600 dark:text-blue-400">
                                {total}
                            </span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3 sm:space-y-4">
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Customer Name (Optional)"
                            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        />
                        <input
                            type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Phone Number (Optional)"
                            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        />
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notes (Optional)"
                            rows="2"
                            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                        >
                            {isProcessing ? "Processing..." : "Complete Sale"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
