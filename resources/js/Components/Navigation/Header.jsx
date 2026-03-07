import { Link } from "@inertiajs/react";
import { FaPills, FaShoppingCart, FaBars, FaUser } from "react-icons/fa";

export default function Header({ cartCount, setSidebarOpen, isActive }) {
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-40 transition-colors duration-200">
            <div className="sm:max-w-2xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                href={route("medicines.index")}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive("/medicines")
                                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <FaPills className="inline mr-1" /> Medicines
                            </Link>

                            <Link
                                href="/cart"
                                className={`px-3 py-2 rounded-md text-sm font-medium relative transition-colors ${
                                    isActive("/cart")
                                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <FaShoppingCart className="inline mr-1" /> Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => window.location.replace("/admin")}
                            className={`px-3 py-2 rounded-md text-sm font-medium relative transition-colors ${
                                isActive("/admin")
                                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            <FaUser className="inline mr-2" /> Go to Admin
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
