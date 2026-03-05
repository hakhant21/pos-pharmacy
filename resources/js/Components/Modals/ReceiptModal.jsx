import { FaCheckCircle, FaPrint } from "react-icons/fa";
import Modal from "@/Components/Modal";

export const ReceiptModal = ({ show, onClose, receipt, onPrint, onDone }) => (
    <Modal show={show} onClose={onClose} maxWidth="md">
        <div className="p-4 sm:p-6">
            <div className="text-center mb-4">
                <FaCheckCircle className="text-green-600 text-4xl sm:text-5xl mx-auto" />
            </div>

            <div
                id="receipt-content"
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 mb-4"
            >
                <div className="text-center mb-3">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                        Pharmacy POS
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {new Date().toLocaleString()}
                    </p>
                </div>

                <div className="border-t border-b border-gray-200 dark:border-gray-600 py-2 mb-2">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Invoice:</span>{" "}
                        {receipt.invoice_number}
                    </p>
                    {receipt.customer_name && (
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Customer:</span>{" "}
                            {receipt.customer_name}
                        </p>
                    )}
                </div>

                {receipt.items.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between text-xs sm:text-sm mb-2"
                    >
                        <div>
                            <span className="text-gray-900 dark:text-gray-100">
                                {item.medicine_name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 block">
                                x{item.quantity} @ {item.unit_price}
                            </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {item.total_price}
                        </span>
                    </div>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2 flex justify-between font-bold">
                    <span className="text-gray-700 dark:text-gray-300">
                        Total:
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                        {receipt.total}
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                    onClick={onPrint}
                    className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base flex items-center justify-center gap-2 order-2 sm:order-1"
                >
                    <FaPrint /> Print
                </button>
                <button
                    onClick={onDone}
                    className="flex-1 px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base order-1 sm:order-2"
                >
                    Done
                </button>
            </div>
        </div>
    </Modal>
);
