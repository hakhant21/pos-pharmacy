// resources/js/Pages/Cart/Index.jsx

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { FaTrash, FaCreditCard, FaCheckCircle, FaPrint, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

export default function Index({ cart: initialCart, cartCount: initialCount, subtotal, total }) {
    const [cart, setCart] = useState(initialCart);
    const [cartCount, setCartCount] = useState(initialCount);

    // UI State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Checkout form
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');

    // Receipt data
    const [receipt, setReceipt] = useState({
        invoice_number: '',
        customer_name: '',
        items: [],
        total: ''
    });

    // Fetch API calls for cart operations
    const updateQuantity = async (index, newQuantity) => {
        if (newQuantity < 1) {
            confirmDelete(index);
            return;
        }

        try {
            const response = await fetch('/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ index, quantity: newQuantity })
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.cart);
                setCartCount(data.cart_count);

                if (window.showToast) {
                    window.showToast('Cart updated', 'success');
                }
                window.dispatchEvent(new CustomEvent('cart-updated'));
            } else {
                if (window.showToast) {
                    window.showToast(data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            if (window.showToast) {
                window.showToast('Error updating cart', 'error');
            }
        }
    };

    const confirmDelete = (index) => {
        setDeleteIndex(index);
        setShowDeleteModal(true);
    };

    const removeItem = async () => {
        if (deleteIndex === null) return;

        try {
            const response = await fetch(`/cart/remove/${deleteIndex}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.cart);
                setCartCount(data.cart_count);

                setShowDeleteModal(false);
                setDeleteIndex(null);

                if (window.showToast) {
                    window.showToast('Item removed from cart', 'info');
                }
                window.dispatchEvent(new CustomEvent('cart-updated'));
            } else {
                if (window.showToast) {
                    window.showToast(data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error removing item:', error);
            if (window.showToast) {
                window.showToast('Error removing item', 'error');
            }
        }
    };

    const clearCart = async () => {
        if (!confirm('Are you sure you want to clear all items?')) return;

        try {
            const response = await fetch('/cart/clear', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (data.success) {
                setCart([]);
                setCartCount(0);

                if (window.showToast) {
                    window.showToast('Cart cleared', 'info');
                }
                window.dispatchEvent(new CustomEvent('cart-updated'));
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            if (window.showToast) {
                window.showToast('Error clearing cart', 'error');
            }
        }
    };

    const processCheckout = async (e) => {
        e.preventDefault();

        setIsProcessing(true);

        try {
            const response = await fetch('/cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    notes
                })
            });

            const data = await response.json();

            if (data.success) {
                setReceipt({
                    invoice_number: data.sale.invoice_number,
                    customer_name: customerName,
                    items: data.sale.items,
                    total: data.sale.total
                });

                setCart([]);
                setCartCount(0);

                setShowCheckoutModal(false);
                setShowReceiptModal(true);

                if (window.showToast) {
                    window.showToast('Sale completed successfully!', 'success');
                }
                window.dispatchEvent(new CustomEvent('cart-updated'));
            } else {
                if (window.showToast) {
                    window.showToast(data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            if (window.showToast) {
                window.showToast('Checkout failed', 'error');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const printReceipt = () => {
        const receiptContent = document.getElementById('receipt-content')?.outerHTML;
        if (!receiptContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt - ${receipt.invoice_number}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .text-sm { font-size: 12px; }
                        .mb-2 { margin-bottom: 8px; }
                        .mb-3 { margin-bottom: 12px; }
                        .mt-2 { margin-top: 8px; }
                        .pt-2 { padding-top: 8px; }
                        .border-t { border-top: 1px solid #ddd; }
                        .border-b { border-bottom: 1px solid #ddd; }
                        .py-2 { padding-top: 8px; padding-bottom: 8px; }
                        .flex { display: flex; }
                        .justify-between { justify-content: space-between; }
                    </style>
                </head>
                <body>
                    ${receiptContent}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    if (cartCount === 0) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Cart
                    </h2>
                }
            >
                <Head title="Shopping Cart" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <FaShoppingCart className="text-6xl text-gray-300" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                                <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                                <Link
                                    href="/medicines"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
                                >
                                    Browse Medicines
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </h2>
            }
        >
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>

                        <button
                            onClick={clearCart}
                            className="mt-2 sm:mt-0 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            <FaTrash className="inline mr-2" /> Clear Cart
                        </button>
                    </div>

                    {/* Cart Items for Desktop */}
                    <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strength</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{item.medicine_name}</div>
                                            <div className="text-sm text-gray-500">
                                                Batch #{item.batch_id} | Exp: {item.expiry_date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.strength}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.unit_price_display}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(index, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                                >
                                                    <FaMinus className="text-xs" />
                                                </button>
                                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(index, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                                    disabled={item.quantity >= item.available}
                                                >
                                                    <FaPlus className="text-xs" />
                                                </button>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Available: {item.available}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.total_price_display}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => confirmDelete(index)}
                                                className="text-red-600 hover:text-red-900 transition"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cart Items for Mobile */}
                    <div className="md:hidden space-y-4 mb-6">
                        {cart.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{item.medicine_name}</h3>
                                        <p className="text-sm text-gray-600">{item.strength}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Batch #{item.batch_id} | Exp: {item.expiry_date}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => confirmDelete(index)}
                                        className="text-red-600 p-2"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <span className="text-xs text-gray-500">Unit Price</span>
                                        <p className="font-medium">{item.unit_price_display}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">Available</span>
                                        <p className="font-medium">{item.available}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-600">Quantity:</span>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                                        >
                                            <FaMinus className="text-xs" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                                            disabled={item.quantity >= item.available}
                                        >
                                            <FaPlus className="text-xs" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="font-medium">Total:</span>
                                    <span className="text-lg font-bold text-blue-600">{item.total_price_display}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-4 sm:mb-0">
                                <div className="flex items-center justify-between sm:justify-start sm:space-x-8">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="text-xl font-bold text-gray-900">{subtotal}</span>
                                </div>
                                <div className="flex items-center justify-between sm:justify-start sm:space-x-8 mt-2">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="text-2xl font-bold text-blue-600">{total}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCheckoutModal(true)}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto text-lg flex items-center justify-center"
                            >
                                <FaCreditCard className="mr-2" /> Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <FaTrash className="text-red-600 text-2xl" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Remove Item</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to remove this item from your cart?
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={removeItem}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Checkout Modal */}
            <Modal show={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Complete Checkout</h2>

                    <form onSubmit={processCheckout}>
                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-medium mb-3">Order Summary</h3>
                            {cart.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm mb-2">
                                    <div>
                                        <span>{item.medicine_name} ({item.strength})</span>
                                        <span className="text-xs text-gray-500 block">
                                            x{item.quantity} @ {item.unit_price_display}
                                        </span>
                                    </div>
                                    <span className="font-medium">{item.total_price_display}</span>
                                </div>
                            ))}
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                                <span>Total:</span>
                                <span className="text-blue-600">{total}</span>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Customer Name (Optional)"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Phone Number (Optional)"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Notes (Optional)"
                                rows="2"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowCheckoutModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Complete Sale'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Receipt Modal */}
            <Modal show={showReceiptModal} onClose={() => setShowReceiptModal(false)} maxWidth="md">
                <div className="p-6">
                    <div className="text-center mb-4">
                        <FaCheckCircle className="text-green-600 text-5xl mx-auto" />
                    </div>

                    <div id="receipt-content" className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-center mb-3">
                            <h3 className="font-bold text-lg">Pharmacy POS</h3>
                            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
                        </div>

                        <div className="border-t border-b py-2 mb-2">
                            <p className="text-sm">
                                <span className="font-medium">Invoice:</span> {receipt.invoice_number}
                            </p>
                            {receipt.customer_name && (
                                <p className="text-sm">
                                    <span className="font-medium">Customer:</span> {receipt.customer_name}
                                </p>
                            )}
                        </div>

                        {receipt.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm mb-2">
                                <div>
                                    <span>{item.medicine_name}</span>
                                    <span className="text-xs text-gray-500 block">
                                        x{item.quantity} @ {item.unit_price}
                                    </span>
                                </div>
                                <span className="font-medium">{item.total_price}</span>
                            </div>
                        ))}

                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="text-blue-600">{receipt.total}</span>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={printReceipt}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                        >
                            <FaPrint className="mr-2" /> Print
                        </button>
                        <button
                            onClick={() => {
                                setShowReceiptModal(false);
                                router.visit('/medicines');
                            }}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
