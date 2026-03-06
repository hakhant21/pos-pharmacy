import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import {
    FaSearch,
    FaEye,
    FaCartPlus,
    FaMinus,
    FaPlus,
    FaFilter,
    FaTimes,
    FaBox,
    FaCalendarAlt,
    FaArrowLeft,
    FaChartLine,
    FaMoneyBillWave,
    FaShoppingBag,
    FaUsers,
    FaTrophy,
    FaCalculator,
} from "react-icons/fa";

export default function Index({
    medicines,
    categories,
    filters,
    salesSummary,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [category, setCategory] = useState(filters.category || "");
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showBatchesModal, setShowBatchesModal] = useState(false);
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    // Calculate total of recent sales
    const recentSalesTotal =
        salesSummary?.recent_sales?.reduce(
            (sum, sale) => sum + parseFloat(sale.total || 0),
            0,
        ) || 0;

    const handleSearch = (value) => {
        setSearch(value);
        router.get(
            route("medicines.index"),
            { search: value, category },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        setShowMobileFilters(false);
        router.get(
            route("medicines.index"),
            { search, category: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setShowMobileFilters(false);
        router.get(
            route("medicines.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const viewBatches = async (medicine) => {
        setLoading(true);
        try {
            const response = await fetch(`/medicines/${medicine.id}/batches`);
            const data = await response.json();
            setSelectedMedicine(data);
            setShowBatchesModal(true);
        } catch (error) {
            console.error("Error fetching batches:", error);
            if (window.showToast) {
                window.showToast("Error loading batches", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const openQuantityModal = (batch) => {
        setSelectedBatch(batch);
        setQuantity(1);
        setShowQuantityModal(true);
    };

    const addToCart = async () => {
        if (!selectedBatch) return;

        try {
            const response = await fetch("/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                body: JSON.stringify({
                    batch_id: selectedBatch.id,
                    quantity: quantity,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setShowQuantityModal(false);
                setShowBatchesModal(false);
                if (window.showToast) {
                    window.showToast(data.message, "success");
                }
                window.dispatchEvent(new CustomEvent("cart-updated"));
            } else {
                if (window.showToast) {
                    window.showToast(data.message, "error");
                }
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            if (window.showToast) {
                window.showToast("Error adding to cart", "error");
            }
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price) + " Kyat";
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const getStockStatus = (stock) => {
        if (stock > 20)
            return {
                text: "In Stock",
                color: "text-green-600",
                bg: "bg-green-100",
            };
        if (stock > 5)
            return {
                text: "Low Stock",
                color: "text-yellow-600",
                bg: "bg-yellow-100",
            };
        if (stock > 0)
            return {
                text: "Critical",
                color: "text-red-600",
                bg: "bg-red-100",
            };
        return {
            text: "Out of Stock",
            color: "text-gray-600",
            bg: "bg-gray-100",
        };
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Medicines
                </h2>
            }
        >
            <Head title="Medicines" />

            <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div>
                        {/* Sales Summary Section */}
                        {salesSummary && (
                            <div className="mb-6 sm:mb-8">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                                    {/* Summary Header */}
                                    <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                        <div className="flex items-center space-x-2">
                                            <FaChartLine className="text-lg sm:text-xl" />
                                            <h2 className="text-base sm:text-lg font-semibold">
                                                Sales Overview
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                    Total Sales
                                                </span>
                                                <FaShoppingBag className="text-blue-600 dark:text-blue-400 text-sm sm:text-base" />
                                            </div>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {formatNumber(
                                                    salesSummary.total_sales,
                                                )}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                +{salesSummary.today_sales}{" "}
                                                today
                                            </p>
                                        </div>

                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                    Items Sold
                                                </span>
                                                <FaBox className="text-green-600 dark:text-green-400 text-sm sm:text-base" />
                                            </div>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {formatNumber(
                                                    salesSummary.total_items_sold,
                                                )}
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 sm:p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                    Total Revenue
                                                </span>
                                                <FaMoneyBillWave className="text-purple-600 dark:text-purple-400 text-sm sm:text-base" />
                                            </div>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {formatPrice(
                                                    salesSummary.total_revenue,
                                                )}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                +
                                                {formatPrice(
                                                    salesSummary.today_revenue,
                                                )}{" "}
                                                today
                                            </p>
                                        </div>

                                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 sm:p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                    Avg. Order
                                                </span>
                                                <FaUsers className="text-orange-600 dark:text-orange-400 text-sm sm:text-base" />
                                            </div>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {formatPrice(
                                                    salesSummary.average_order_value,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Recent Sales Table with Total */}

                                    {salesSummary.recent_sales &&
                                        salesSummary.recent_sales.length >
                                            0 && (
                                            <div className="border-t border-gray-200 dark:border-gray-700">
                                                <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                                                    <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                                                        Total Sales
                                                    </h3>
                                                    <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                                        <FaCalculator className="text-blue-600 dark:text-blue-400 text-xs" />
                                                        <span className="text-2xl font-medium text-blue-600 dark:text-blue-400">
                                                            Total:{" "}
                                                            {formatPrice(
                                                                recentSalesTotal,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Filters - Desktop */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Category Filter */}
                            <div>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        handleCategoryChange(e.target.value)
                                    }
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-gray-100"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Search */}
                            <div className="lg:col-span-3">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        placeholder="Search by medicine name..."
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="w-full bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center justify-center space-x-2"
                        >
                            <FaFilter className="text-blue-600" />
                            <span className="font-medium">
                                Filter Medicines
                            </span>
                        </button>
                    </div>

                    {/* Mobile Filters Modal */}
                    <Modal
                        show={showMobileFilters}
                        onClose={() => setShowMobileFilters(false)}
                        maxWidth="sm"
                    >
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Filter Medicines
                                </h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Search medicines..."
                                            className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleSearch(search);
                                            setShowMobileFilters(false);
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    {/* Active Filters */}
                    {(search || category) && (
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Active filters:
                            </span>
                            {category && (
                                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    Category:{" "}
                                    {
                                        categories.find((c) => c.id == category)
                                            ?.name
                                    }
                                    <button
                                        onClick={() => handleCategoryChange("")}
                                        className="ml-2 hover:text-blue-600"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </span>
                            )}
                            {search && (
                                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    Search: {search}
                                    <button
                                        onClick={() => handleSearch("")}
                                        className="ml-2 hover:text-blue-600"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Medicines Grid */}
                    {medicines.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 sm:p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <FaBox className="text-5xl sm:text-6xl text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No medicines found
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                                Try adjusting your search or filter to find what
                                you're looking for.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            {medicines.data.map((medicine) => {
                                const stockStatus = getStockStatus(
                                    medicine.total_stock,
                                );
                                return (
                                    <div
                                        key={medicine.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="p-4 sm:p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                                                    {medicine.name}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}
                                                >
                                                    {stockStatus.text}
                                                </span>
                                            </div>

                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {medicine.category}
                                            </p>

                                            {/* Stock Summary Cards */}
                                            <div className="grid grid-cols-2 gap-2 mt-3">
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Total Stock
                                                    </span>
                                                    <p
                                                        className={`font-bold text-sm sm:text-base ${medicine.total_stock > 0 ? "text-green-600" : "text-red-600"}`}
                                                    >
                                                        {medicine.total_stock}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Batches
                                                    </span>
                                                    <p className="font-bold text-sm sm:text-base text-blue-600">
                                                        {medicine.batch_count}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-4">
                                                <button
                                                    onClick={() =>
                                                        viewBatches(medicine)
                                                    }
                                                    disabled={
                                                        medicine.total_stock ===
                                                        0
                                                    }
                                                    className={`w-full px-4 py-2.5 sm:py-3 rounded-lg transition flex items-center justify-center space-x-2 text-sm sm:text-base ${
                                                        medicine.total_stock > 0
                                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                >
                                                    <FaEye className="text-sm sm:text-base" />
                                                    <span>View Batches</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {medicines.links && medicines.links.length > 3 && (
                        <div className="mt-6 sm:mt-8 flex justify-center">
                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                {medicines.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                                        disabled={!link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </>

            {/* Batches Modal - Larger Size */}
            <Modal
                show={showBatchesModal}
                onClose={() => setShowBatchesModal(false)}
                maxWidth="4xl"
            >
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {selectedMedicine?.name}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Available Batches
                            </p>
                        </div>
                        <button
                            onClick={() => setShowBatchesModal(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 sm:py-16">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600">
                                Loading batches...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {selectedMedicine?.batches?.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <FaBox className="text-4xl text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No batches available
                                    </p>
                                </div>
                            ) : (
                                selectedMedicine?.batches?.map((batch) => (
                                    <div
                                        key={batch.id}
                                        className={`border rounded-lg p-4 sm:p-5 transition-all hover:shadow-md ${
                                            batch.days_to_expiry <= 60
                                                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                        }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                                    <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {batch.strength_display}
                                                    </span>
                                                    {batch.days_to_expiry <=
                                                        60 && (
                                                        <span className="px-2 sm:px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm rounded-full flex items-center">
                                                            <FaCalendarAlt className="mr-1 text-xs" />
                                                            Expires in{" "}
                                                            {
                                                                batch.days_to_expiry
                                                            }{" "}
                                                            days
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-2">
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                            Batch #
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {batch.batch_no}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                            Expiry
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {batch.expiry_date}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                            Available
                                                        </span>
                                                        <span className="text-sm font-medium text-green-600">
                                                            {
                                                                batch.available_quantity
                                                            }{" "}
                                                            units
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:flex-col xl:flex-row">
                                                <div className="text-left lg:text-right">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                        Price
                                                    </span>
                                                    <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                        {formatPrice(
                                                            batch.selling_price,
                                                        )}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        openQuantityModal(batch)
                                                    }
                                                    disabled={
                                                        batch.available_quantity ===
                                                        0
                                                    }
                                                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto ${
                                                        batch.available_quantity >
                                                        0
                                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                >
                                                    <FaCartPlus />
                                                    <span>Add to Cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </Modal>

            {/* Quantity Modal - Medium Size */}
            <Modal
                show={showQuantityModal}
                onClose={() => setShowQuantityModal(false)}
                maxWidth="lg"
            >
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Select Quantity
                        </h2>
                        <button
                            onClick={() => setShowQuantityModal(false)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {selectedBatch && (
                        <div>
                            {/* Product Summary */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            {selectedBatch.strength_display}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                    Price per unit
                                                </span>
                                                <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {formatPrice(
                                                        selectedBatch.selling_price,
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                    Available stock
                                                </span>
                                                <p className="text-xl sm:text-2xl font-bold text-green-600">
                                                    {
                                                        selectedBatch.available_quantity
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:text-right">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                            Batch #
                                        </span>
                                        <p className="text-base font-medium">
                                            {selectedBatch.batch_no}
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 block mt-2">
                                            Expiry
                                        </span>
                                        <p className="text-base font-medium">
                                            {selectedBatch.expiry_date}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center justify-center sm:justify-start">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1),
                                            )
                                        }
                                        className="w-10 h-10 sm:w-12 sm:h-12 border rounded-l-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
                                    >
                                        <FaMinus />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                Math.min(
                                                    selectedBatch.available_quantity,
                                                    Math.max(
                                                        1,
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                    ),
                                                ),
                                            )
                                        }
                                        min="1"
                                        max={selectedBatch.available_quantity}
                                        className="w-16 sm:w-20 h-10 sm:h-12 text-center border-t border-b border-gray-300 dark:border-gray-600 focus:outline-none dark:bg-gray-700 dark:text-gray-100 text-base sm:text-lg"
                                    />
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.min(
                                                    selectedBatch.available_quantity,
                                                    quantity + 1,
                                                ),
                                            )
                                        }
                                        className="w-10 h-10 sm:w-12 sm:h-12 border rounded-r-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            {/* Total and Actions */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                                        Total Amount:
                                    </span>
                                    <div className="text-right">
                                        <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatPrice(
                                                quantity *
                                                    selectedBatch.selling_price,
                                            )}
                                        </span>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            ({quantity} x{" "}
                                            {formatPrice(
                                                selectedBatch.selling_price,
                                            )}
                                            )
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() =>
                                            setShowQuantityModal(false)
                                        }
                                        className="flex-1 px-4 py-3 sm:py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-base sm:text-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addToCart}
                                        className="flex-1 px-4 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base sm:text-lg flex items-center justify-center space-x-2"
                                    >
                                        <FaCartPlus />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
