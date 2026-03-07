import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

export const EmptyCart = () => (
    <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Cart
            </h2>
        }
    >
        <Head title="Shopping Cart" />

        <div className="py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 sm:p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <FaShoppingCart className="text-6xl sm:text-7xl text-gray-300 dark:text-gray-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6">
                            Looks like you haven't added any items to your cart
                            yet.
                        </p>
                        <Link
                            href={route('medicines.index')}
                            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaArrowLeft className="mr-2 text-sm" />
                            Browse Medicines
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
);
