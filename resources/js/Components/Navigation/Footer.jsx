import { Link } from "@inertiajs/react";
import { FaShoppingCart, FaPills, FaUser } from "react-icons/fa";

export default function Footer({ cartCount, isActive }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-2 px-4 md:hidden z-40 transition-colors duration-200">
            <Link
                href="route('medicines.index')"
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
    );
}
