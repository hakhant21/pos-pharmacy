import { FaTrash } from "react-icons/fa";
import { ModalTemplate } from "./ModalTemplate";

export const DeleteConfirmationModal = ({ show, onClose, onConfirm }) => (
    <ModalTemplate
        show={show}
        onClose={onClose}
        title="Remove Item"
        icon={FaTrash}
        iconBgColor="bg-red-100 dark:bg-red-900/30"
        iconColor="text-red-600 dark:text-red-400"
    >
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-6">
            Are you sure you want to remove this item from your cart?
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base order-2 sm:order-1"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base order-1 sm:order-2"
            >
                Remove
            </button>
        </div>
    </ModalTemplate>
);
