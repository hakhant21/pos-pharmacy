import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CartItemCard } from "@/Components/Cart/CartItemCard";
import { CartSummary } from "@/Components/Cart/CartSummary";
import { EmptyCart } from "@/Components/Cart/EmptyCart";
import { DeleteConfirmationModal } from "@/Components/Modals/DeleteConfirmationModal";
import { CheckoutModal } from "@/Components/Modals/CheckoutModal";
import { ReceiptModal } from "@/Components/Modals/ReceiptModal";
import { useCartOperations } from "@/Hooks/useCartOperations";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Index({
    cart: initialCart,
    cartCount: initialCount,
    subtotal,
    total,
}) {
    const [cart, setCart] = useState(initialCart);
    const [cartCount, setCartCount] = useState(initialCount);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [receipt, setReceipt] = useState({
        invoice_number: "",
        customer_name: "",
        items: [],
        total: "",
    });

    const {
        updateQuantity,
        removeItem,
        clearCart,
        processCheckout,
        isLoading,
    } = useCartOperations(setCart, setCartCount);

    const handleUpdateQuantity = async (index, newQuantity) => {
        try {
            const result = await updateQuantity(index, newQuantity);
            if (result?.needsDelete) {
                setDeleteIndex(index);
                setShowDeleteModal(true);
            } else {
                toast.success("Quantity updated");
            }
        } catch (error) {
            toast.error(error.message || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async () => {
        if (deleteIndex === null) return;

        try {
            await removeItem(deleteIndex);
            setShowDeleteModal(false);
            setDeleteIndex(null);
            toast.success("Item removed successfully");
        } catch (error) {
            toast.error(error.message || "Failed to remove item");
        }
    };

    const handleClearCart = async () => {
        if (confirm("Are you sure you want to clear your cart?")) {
            try {
                await clearCart();
                toast.success("Cart cleared successfully", "success");
            } catch (error) {
                toast.error(error.message || "Failed to clear cart");
            }
        }
    };

    const handleCheckout = async ({ customerName, customerPhone, notes }) => {
        setIsProcessing(true);

        try {
            const result = await processCheckout({
                customer_name: customerName,
                customer_phone: customerPhone,
                notes,
            });

            if (result.success) {
                setReceipt({
                    invoice_number: result.sale.invoice_number,
                    customer_name: customerName,
                    items: result.sale.items,
                    total: result.sale.total,
                });

                setCart([]);
                setCartCount(0);
                setShowCheckoutModal(false);
                setShowReceiptModal(false);
                router.visit("/medicines");
            } else {
                toast.error(result.message || "Checkout failed.");
            }
        } catch (error) {
            toast.error("Checkout failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const printReceipt = () => {
        const receiptContent =
            document.getElementById("receipt-content")?.outerHTML;

        if (!receiptContent) {
            toast.error("Receipt content not found");
            return;
        }

        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            toast.error("Could not open print window");
            return;
        }

        const printDocument = printWindow.document;

        const html = `
            <html>
                <head>
                    <title>Receipt - ${receipt.invoice_number}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .text-sm { font-size: 12px; }
                        .text-xs { font-size: 11px; }
                        /* ... rest of the styles ... */
                    </style>
                </head>
                <body>
                    ${receiptContent}
                </body>
            </html>`;

        const printElement = printDocument.createElement("div");
        printElement.innerHTML = html;

        printDocument.body.appendChild(printElement);

        printWindow.onload = function () {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };

        toast.success("Receipt sent to printer");
    };

    if (cartCount === 0) {
        return <EmptyCart />;
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                </h2>
            }
        >
            <Head title="Shopping Cart" />

            <div className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/medicines"
                                className="sm:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <FaArrowLeft />
                            </Link>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Shopping Cart
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                                    {cartCount}{" "}
                                    {cartCount === 1 ? "item" : "items"} in your
                                    cart
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClearCart}
                            disabled={isLoading}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaTrash className="inline mr-1 sm:mr-2 text-xs sm:text-sm" />
                            <span className="hidden xs:inline">Clear Cart</span>
                            <span className="xs:hidden">Clear</span>
                        </button>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        {[
                                            "Product",
                                            "Strength",
                                            "Unit Price",
                                            "Quantity",
                                            "Total",
                                            "Action",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {cart.map((item, index) => (
                                        <CartItemCard
                                            key={index}
                                            item={item}
                                            index={index}
                                            onUpdateQuantity={
                                                handleUpdateQuantity
                                            }
                                            onDelete={() => {
                                                setDeleteIndex(index);
                                                setShowDeleteModal(true);
                                            }}
                                            isMobile={false}
                                            isLoading={isLoading}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile/Tablet View */}
                    <div className="md:hidden space-y-3 sm:space-y-4 mb-6">
                        {cart.map((item, index) => (
                            <CartItemCard
                                key={index}
                                item={item}
                                index={index}
                                onUpdateQuantity={handleUpdateQuantity}
                                onDelete={() => {
                                    setDeleteIndex(index);
                                    setShowDeleteModal(true);
                                }}
                                isMobile={true}
                                isLoading={isLoading}
                            />
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <CartSummary
                        subtotal={subtotal}
                        total={total}
                        onCheckout={() => setShowCheckoutModal(true)}
                        isProcessing={isProcessing}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Modals */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleRemoveItem}
                isProcessing={isProcessing || isLoading}
                onDone={() => {
                    setShowDeleteModal(false);
                    setDeleteIndex(null);
                }}
            />

            <CheckoutModal
                show={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                cart={cart}
                total={total}
                onCheckout={handleCheckout}
                isProcessing={isProcessing || isLoading}
                onDone={() => {
                    setShowCheckoutModal(false);
                    router.visit("/medicines");
                }}
            />

            <ReceiptModal
                show={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
                receipt={receipt}
                onPrint={printReceipt}
                onDone={() => {
                    setShowReceiptModal(false);
                    router.visit("/medicines");
                }}
            />
        </AuthenticatedLayout>
    );
}
