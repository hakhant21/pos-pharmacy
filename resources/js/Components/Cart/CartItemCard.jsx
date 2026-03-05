import { QuantityControls } from "@/Components/Common/QuantityControls";
import { DeleteButton } from "@/Components/Common/DeleteButton";
import { PriceInfo } from "./PriceInfo";

export const CartItemCard = ({
    item,
    index,
    onUpdateQuantity,
    onDelete,
    isMobile,
}) => {
    if (isMobile) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
                <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="flex-1 pr-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                            {item.medicine_name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {item.strength}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Batch #{item.batch_id} | Exp: {item.expiry_date}
                        </p>
                    </div>
                    <DeleteButton onDelete={() => onDelete(index)} />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <PriceInfo
                        label="Unit Price"
                        value={item.unit_price_display}
                    />
                    <PriceInfo label="Available" value={item.available} />
                </div>

                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Quantity:
                    </span>
                    <QuantityControls
                        quantity={item.quantity}
                        available={item.available}
                        onIncrease={() =>
                            onUpdateQuantity(index, item.quantity + 1)
                        }
                        onDecrease={() =>
                            onUpdateQuantity(index, item.quantity - 1)
                        }
                    />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Total:
                    </span>
                    <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                        {item.total_price_display}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-4 lg:px-6 py-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {item.medicine_name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Batch #{item.batch_id} | Exp: {item.expiry_date}
                </div>
            </td>
            <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {item.strength}
            </td>
            <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {item.unit_price_display}
            </td>
            <td className="px-4 lg:px-6 py-4">
                <QuantityControls
                    quantity={item.quantity}
                    available={item.available}
                    onIncrease={() =>
                        onUpdateQuantity(index, item.quantity + 1)
                    }
                    onDecrease={() =>
                        onUpdateQuantity(index, item.quantity - 1)
                    }
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Available: {item.available}
                </div>
            </td>
            <td className="px-4 lg:px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                {item.total_price_display}
            </td>
            <td className="px-4 lg:px-6 py-4">
                <DeleteButton onDelete={() => onDelete(index)} />
            </td>
        </tr>
    );
};
