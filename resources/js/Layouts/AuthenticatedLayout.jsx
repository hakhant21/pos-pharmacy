import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FaPills, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthenticatedLayout({ header, children }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme === "dark";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        fetchCartCount();

        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener("cart-updated", handleCartUpdate);

        return () => {
            window.removeEventListener("cart-updated", handleCartUpdate);
        };
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    // Set up global toast function
    useEffect(() => {
        window.showToast = (message, type = "info") => {
            const options = {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: isDarkMode ? "dark" : "light",
            };

            switch (type) {
                case "success":
                    toast.success(message, options);
                    break;
                case "error":
                    toast.error(message, options);
                    break;
                case "warning":
                    toast.warning(message, options);
                    break;
                default:
                    toast.info(message, options);
            }
        };

        return () => {
            delete window.showToast;
        };
    }, [isDarkMode]);

    const fetchCartCount = async () => {
        try {
            const response = await fetch("/cart/count");
            const data = await response.json();
            setCartCount(data.count);
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    };

    const isActive = (path) => {
        return url.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-40 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                            >
                                <FaBars className="text-xl" />
                            </button>

                            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                                <FaPills className="text-2xl text-blue-600 dark:text-blue-400 mr-2" />
                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                    Pharmacy
                                    <span className="text-blue-600 dark:text-blue-400">
                                        POS
                                    </span>
                                </span>
                            </div>

                            <div className="hidden md:ml-6 md:flex md:space-x-4">
                                <Link
                                    href="/medicines"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive("/medicines")
                                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <FaPills className="inline mr-1" />{" "}
                                    Medicines
                                </Link>

                                <Link
                                    href="/cart"
                                    className={`px-3 py-2 rounded-md text-sm font-medium relative transition-colors ${
                                        isActive("/cart")
                                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <FaShoppingCart className="inline mr-1" />{" "}
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
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
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />

                    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-800 dark:text-white">
                                Pharmacy POS
                            </span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="space-y-2">
                                <Link
                                    href="/medicines"
                                    className={`block px-4 py-2 rounded-lg transition-colors ${
                                        isActive("/medicines")
                                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <FaPills className="inline mr-2" />{" "}
                                    Medicines
                                </Link>

                                <Link
                                    href="/cart"
                                    className={`block px-4 py-2 rounded-lg relative transition-colors ${
                                        isActive("/cart")
                                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <FaShoppingCart className="inline mr-2" />{" "}
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
                    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="min-h-screen pt-16 px-2 sm:px-4">
                <div className="max-w-7xl mx-auto">
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme={isDarkMode ? "dark" : "light"}
                    />
                    {children}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-2 px-4 md:hidden z-40 transition-colors duration-200">
                <Link
                    href="/medicines"
                    className={`flex flex-col items-center transition-colors ${
                        isActive("/medicines")
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    <FaPills className="text-xl" />
                    <span className="text-xs mt-1">Medicines</span>
                </Link>

                <Link
                    href="/cart"
                    className={`flex flex-col items-center relative transition-colors ${
                        isActive("/cart")
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    <FaShoppingCart className="text-xl" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                    <span className="text-xs mt-1">Cart</span>
                </Link>
            </div>
        </div>
    );
}
