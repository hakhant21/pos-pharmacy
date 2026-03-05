import { useCallback } from "react";

const API_ENDPOINTS = {
    UPDATE: "/cart/update",
    REMOVE: (index) => `/cart/remove/${index}`,
    CLEAR: "/cart/clear",
    CHECKOUT: "/cart/checkout",
};

export const useCartOperations = (setCart, setCartCount) => {
    const getCsrfToken = useCallback(
        () =>
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "",
        [],
    );

    const handleResponse = useCallback(
        async (response, successMessage, errorMessage) => {
            const data = await response.json();

            if (data.success) {
                if (data.cart) setCart(data.cart);
                if (data.cart_count !== undefined)
                    setCartCount(data.cart_count);

                if (window.showToast) {
                    window.showToast(successMessage, "success");
                }
                window.dispatchEvent(new CustomEvent("cart-updated"));
            } else {
                if (window.showToast) {
                    window.showToast(data.message || errorMessage, "error");
                }
            }
            return data;
        },
        [setCart, setCartCount],
    );

    const updateQuantity = useCallback(
        async (index, newQuantity) => {
            if (newQuantity < 1) return { needsDelete: true, index };

            try {
                const response = await fetch(API_ENDPOINTS.UPDATE, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                    body: JSON.stringify({ index, quantity: newQuantity }),
                });

                return await handleResponse(
                    response,
                    "Cart updated",
                    "Error updating cart",
                );
            } catch (error) {
                console.error("Error updating cart:", error);
                if (window.showToast)
                    window.showToast("Error updating cart", "error");
            }
        },
        [getCsrfToken, handleResponse],
    );

    const removeItem = useCallback(
        async (index) => {
            try {
                const response = await fetch(API_ENDPOINTS.REMOVE(index), {
                    method: "DELETE",
                    headers: { "X-CSRF-TOKEN": getCsrfToken() },
                });

                return await handleResponse(
                    response,
                    "Item removed from cart",
                    "Error removing item",
                );
            } catch (error) {
                console.error("Error removing item:", error);
                if (window.showToast)
                    window.showToast("Error removing item", "error");
            }
        },
        [getCsrfToken, handleResponse],
    );

    const clearCart = useCallback(async () => {
        if (!confirm("Are you sure you want to clear all items?")) return;

        try {
            const response = await fetch(API_ENDPOINTS.CLEAR, {
                method: "POST",
                headers: { "X-CSRF-TOKEN": getCsrfToken() },
            });

            return await handleResponse(
                response,
                "Cart cleared",
                "Error clearing cart",
            );
        } catch (error) {
            console.error("Error clearing cart:", error);
            if (window.showToast)
                window.showToast("Error clearing cart", "error");
        }
    }, [getCsrfToken, handleResponse]);

    const processCheckout = useCallback(
        async (customerData) => {
            try {
                const response = await fetch(API_ENDPOINTS.CHECKOUT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": getCsrfToken(),
                    },
                    body: JSON.stringify(customerData),
                });

                return await response.json();
            } catch (error) {
                console.error("Checkout error:", error);
                if (window.showToast)
                    window.showToast("Checkout failed", "error");
                throw error;
            }
        },
        [getCsrfToken],
    );

    return { updateQuantity, removeItem, clearCart, processCheckout };
};
