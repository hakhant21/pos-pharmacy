import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    FaPills,
    FaShoppingCart,
    FaBars,
    FaTimes,
    FaUser,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/Components/Navigation/Header";
import Mobile from "@/Components/Navigation/Mobile";
import Footer from "@/Components/Navigation/Footer";

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
            <Header
                cartCount={cartCount}
                setSidebarOpen={setSidebarOpen}
                isActive={isActive}
            />

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <Mobile
                    cartCount={cartCount}
                    setSidebarOpen={setSidebarOpen}
                    isActive={isActive}
                />
            )}

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
                    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="sm:pt-16 pb-12 transition-colors duration-200">
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

            <Footer cartCount={cartCount} isActive={isActive} />
        </div>
    );
}
