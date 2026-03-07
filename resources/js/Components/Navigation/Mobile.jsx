import { Link } from "@inertiajs/react";
import { FaTimes, FaShoppingCart, FaUser, FaPills } from "react-icons/fa";

export default function Mobile({ cartCount, setSidebarOpen, isActive }) {
    return (
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
                            <FaPills className="inline mr-2" /> Medicines
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
                            <FaShoppingCart className="inline mr-2" /> Cart
                            {cartCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => window.location.replace("/admin")}
                            className={`block px-4 py-2 rounded-lg transition-colors ${
                                isActive("/admin")
                                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            <FaUser className="inline mr-2" /> Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
