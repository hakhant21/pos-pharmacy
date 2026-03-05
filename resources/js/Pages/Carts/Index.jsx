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

    const { updateQuantity, removeItem, clearCart, processCheckout } =
        useCartOperations(setCart, setCartCount);

    const handleUpdateQuantity = async (index, newQuantity) => {
        const result = await updateQuantity(index, newQuantity);
        if (result?.needsDelete) {
            setDeleteIndex(index);
            setShowDeleteModal(true);
        }
    };

    const handleRemoveItem = async () => {
        if (deleteIndex === null) return;
        await removeItem(deleteIndex);
        setShowDeleteModal(false);
        setDeleteIndex(null);
    };

    const handleCheckout = async ({ customerName, customerPhone, notes }) => {
        setIsProcessing(true);

        try {
            const data = await processCheckout({
                customer_name: customerName,
                customer_phone: customerPhone,
                notes,
            });

            if (data.success) {
                setReceipt({
                    invoice_number: data.sale.invoice_number,
                    customer_name: customerName,
                    items: data.sale.items,
                    total: data.sale.total,
                });

                setCart([]);
                setCartCount(0);
                setShowCheckoutModal(false);
                setShowReceiptModal(true);

                if (window.showToast) {
                    window.showToast("Sale completed successfully!", "success");
                }
            } else {
                if (window.showToast) {
                    window.showToast(data.message, "error");
                }
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const printReceipt = () => {
        const receiptContent =
            document.getElementById("receipt-content")?.outerHTML;
        if (!receiptContent) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
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
                        .mb-2 { margin-bottom: 8px; }
                        .mb-3 { margin-bottom: 12px; }
                        .mt-2 { margin-top: 8px; }
                        .pt-2 { padding-top: 8px; }
                        .border-t { border-top: 1px solid #ddd; }
                        .border-b { border-bottom: 1px solid #ddd; }
                        .py-2 { padding-top: 8px; padding-bottom: 8px; }
                        .flex { display: flex; }
                        .justify-between { justify-content: space-between; }
                        @media print { body { padding: 0; } }
                    </style>
                </head>
                <body>${receiptContent}</body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
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
                            onClick={clearCart}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
                            />
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <CartSummary
                        subtotal={subtotal}
                        total={total}
                        onCheckout={() => setShowCheckoutModal(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleRemoveItem}
            />

            <CheckoutModal
                show={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                cart={cart}
                total={total}
                onCheckout={handleCheckout}
                isProcessing={isProcessing}
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
