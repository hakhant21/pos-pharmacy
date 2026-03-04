// resources/js/Pages/Medicines/Index.jsx

import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import {
    FaSearch,
    FaEye,
    FaCartPlus,
    FaShoppingCart,
    FaMinus,
    FaPlus,
} from "react-icons/fa";

export default function Index({ medicines, categories, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [category, setCategory] = useState(filters.category || "");
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showBatchesModal, setShowBatchesModal] = useState(false);
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = (value) => {
        setSearch(value);
        router.get(
            "/medicines",
            { search: value, category },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        router.get(
            "/medicines",
            { search, category: value },
            {
                preserveState: true,
                replace: true,
            }
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
                    "X-CSRF-TOKEN": document
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
        return "$" + parseFloat(price).toFixed(2);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Medicines
                </h2>
            }
        >
            <Head title="Medicines" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Medicines
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Browse and add medicines to cart
                            </p>
                        </div>

                        {/* Cart Icon */}
                        <Link href="/cart" className="relative mt-2 sm:mt-0">
                            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition">
                                <FaShoppingCart className="text-xl text-blue-600" />
                            </div>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        placeholder="Search by medicine name..."
                                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        handleCategoryChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Medicines Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {medicines.data.map((medicine) => (
                            <div
                                key={medicine.id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                            >
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900">
                                        {medicine.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {medicine.category}
                                    </p>

                                    {/* Stock Summary */}
                                    <div className="mt-3 space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Total Stock:
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    medicine.total_stock > 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {medicine.total_stock} units
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Available Batches:
                                            </span>
                                            <span className="font-medium">
                                                {medicine.batch_count}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => viewBatches(medicine)}
                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                                        >
                                            <FaEye className="mr-2" /> View Batches
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {medicines.links && medicines.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            {medicines.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`mx-1 px-3 py-1 rounded ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                    } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={!link.url}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Batches Modal */}
            <Modal show={showBatchesModal} onClose={() => setShowBatchesModal(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {selectedMedicine?.name} - Available Batches
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedMedicine?.batches?.map((batch) => (
                                <div
                                    key={batch.id}
                                    className={`border rounded-lg p-4 ${
                                        batch.days_to_expiry <= 60
                                            ? "bg-yellow-50"
                                            : "bg-white"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="mb-2 sm:mb-0">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <span className="font-medium">
                                                    {batch.strength_display}
                                                </span>
                                                {batch.days_to_expiry <= 60 && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                        Expires in{" "}
                                                        {batch.days_to_expiry} days
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Exp: {batch.expiry_date}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">
                                                    {formatPrice(batch.selling_price)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Stock: {batch.available_quantity}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => openQuantityModal(batch)}
                                                className="bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center"
                                            >
                                                <FaCartPlus className="mr-1" /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>

            {/* Quantity Modal */}
            <Modal show={showQuantityModal} onClose={() => setShowQuantityModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Select Quantity</h2>

                    {selectedBatch && (
                        <div>
                            <div className="mb-4">
                                <p className="font-medium">
                                    {selectedBatch.strength_display}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Price: {formatPrice(selectedBatch.selling_price)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Available: {selectedBatch.available_quantity}
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center">
                                    <button
                                        onClick={() =>
                                            setQuantity(Math.max(1, quantity - 1))
                                        }
                                        className="px-4 py-2 border rounded-l-lg bg-gray-100 hover:bg-gray-200"
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
                                                        parseInt(e.target.value) || 1
                                                    )
                                                )
                                            )
                                        }
                                        min="1"
                                        max={selectedBatch.available_quantity}
                                        className="w-20 text-center border-t border-b py-2 focus:outline-none"
                                    />
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.min(
                                                    selectedBatch.available_quantity,
                                                    quantity + 1
                                                )
                                            )
                                        }
                                        className="px-4 py-2 border rounded-r-lg bg-gray-100 hover:bg-gray-200"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">Total:</span>
                                <span className="text-xl font-bold text-blue-600">
                                    {formatPrice(quantity * selectedBatch.selling_price)}
                                </span>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowQuantityModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addToCart}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
