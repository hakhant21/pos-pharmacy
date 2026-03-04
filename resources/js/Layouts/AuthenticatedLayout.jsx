import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaPills, FaShoppingCart, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';


export default function AuthenticatedLayout({ header, children }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        fetchCartCount();

        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener('cart-updated', handleCartUpdate);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
        };
    }, []);

    const fetchCartCount = async () => {
        try {
            const response = await fetch('/cart/count');
            const data = await response.json();
            setCartCount(data.count);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    const isActive = (path) => {
        return url.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Toast Notification Container */}
            <div id="toast-container" className="fixed top-20 right-4 z-50 space-y-2"></div>

            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left side */}
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                <FaBars className="text-xl" />
                            </button>

                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                                <FaPills className="text-2xl text-blue-600 mr-2" />
                                <span className="text-xl font-bold text-gray-800">
                                    Pharmacy<span className="text-blue-600">POS</span>
                                </span>
                            </div>

                            {/* Desktop Navigation Links */}
                            <div className="hidden md:ml-6 md:flex md:space-x-4">
                                <Link
                                    href="/medicines"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/medicines')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <FaPills className="inline mr-1" /> <span className='mx-1'>Medicines</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                                        isActive('/cart')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <FaShoppingCart className="inline mr-1" /> Cart
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                        <div className="p-4 border-b flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800">Menu</span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="space-y-2">
                                <Link
                                    href="/medicines"
                                    className={`block px-4 py-2 rounded-lg ${
                                        isActive('/medicines')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <FaPills className="inline mr-2" />
                                    <span className='mx-2'>Medicines</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    className={`block px-4 py-2 rounded-lg relative ${
                                        isActive('/cart')
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <FaShoppingCart className="inline mr-2" /> Cart
                                    {cartCount > 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="min-h-screen pt-16 px-2">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 md:hidden z-40">
                <Link
                    href="/medicines"
                    className={`flex flex-col items-center ${
                        isActive('/medicines') ? 'text-blue-600' : 'text-gray-500'
                    }`}
                >
                    <FaPills className="text-xl" />
                    <span className="text-xs mt-1">Medicines</span>
                </Link>
                <Link
                    href="/cart"
                    className={`flex flex-col items-center relative ${
                        isActive('/cart') ? 'text-blue-600' : 'text-gray-500'
                    }`}
                >
                    <FaShoppingCart className="text-xl" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                    <span className="text-xs mt-1">Cart</span>
                </Link>
            </div>
        </div>
    );
}
