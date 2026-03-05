import { useState } from "react";
import { toast } from "react-toastify";

export const useCartOperations = (setCart, setCartCount) => {
    const [isLoading, setIsLoading] = useState(false);

    const updateQuantity = async (index, newQuantity) => {
        setIsLoading(true);
        try {
            const response = await fetch("/cart/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                    Accept: "application/json",
                },
                body: JSON.stringify({ index, quantity: newQuantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update quantity");
            }

            setCart(data.cart);
            setCartCount(data.count);
            window.dispatchEvent(new Event("cart-updated"));

            return data;
        } catch (error) {
            console.error("Update quantity error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (index) => {
        setIsLoading(true);
        try {
            const response = await fetch("/cart/remove/" + index, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                    Accept: "application/json",
                },
                body: JSON.stringify({ index }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to remove item");
            }

            setCart(data.cart);
            setCartCount(data.count);
            window.dispatchEvent(new Event("cart-updated"));

            return data;
        } catch (error) {
            console.error("Remove item error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/cart/clear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to clear cart");
            }

            setCart([]);
            setCartCount(0);
            window.dispatchEvent(new Event("cart-updated"));

            return data;
        } catch (error) {
            console.error("Clear cart error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const processCheckout = async (checkoutData) => {
        setIsLoading(true);
        try {
            const response = await fetch("/cart/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                    Accept: "application/json",
                },
                body: JSON.stringify(checkoutData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Checkout failed");
            }

            window.dispatchEvent(new Event("cart-updated"));

            return {
                success: true,
                message: "Checkout successful",
                sale: data.sale || data,
            };
        } catch (error) {
            console.error("Checkout error:", error);
            return {
                success: false,
                message: error.message || "Checkout failed",
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateQuantity,
        removeItem,
        clearCart,
        processCheckout,
        isLoading,
    };
};
