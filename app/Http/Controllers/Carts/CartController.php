<?php
// app/Http/Controllers/Carts/CartController.php

namespace App\Http\Controllers\Carts;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        $subtotal = collect($cart)->sum('total_price');

        return Inertia::render('Carts/Index', [ // Changed from 'Carts/Index' to 'Cart/Index'
            'cart' => $cart,
            'cartCount' => count($cart),
            'subtotal' => $this->formatPrice($subtotal),
            'total' => $this->formatPrice($subtotal),
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $batch = Batch::with('medicine')->find($request->batch_id);

        if (!$batch) {
            return response()->json([
                'success' => false,
                'message' => 'Batch not found'
            ], 404);
        }

        if (!$batch || $batch->available_quantity < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock available'
            ], 422);
        }

        if ($batch->is_expired) {
            return response()->json([
                'success' => false,
                'message' => 'This batch has expired'
            ], 422);
        }

        $cart = session()->get('cart', []);

        // Check if batch already in cart
        $existingIndex = null;
        foreach ($cart as $index => $item) {
            if ($item['batch_id'] == $request->batch_id) {
                $existingIndex = $index;
                break;
            }
        }

        $priceInCents = $batch->selling_price;

        if ($existingIndex !== null) {
            // Update existing item
            $newQuantity = $cart[$existingIndex]['quantity'] + $request->quantity;
            if ($newQuantity > $batch->available_quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot add more than available stock'
                ], 422);
            }
            $cart[$existingIndex]['quantity'] = $newQuantity;
            $cart[$existingIndex]['total_price'] = $newQuantity * $priceInCents;
            $cart[$existingIndex]['total_price_display'] = $this->formatPrice($newQuantity * $priceInCents);
        } else {
            // Add new item
            $cart[] = [
                'batch_id' => $batch->id,
                'medicine_id' => $batch->medicine_id,
                'medicine_name' => $batch->medicine->name,
                'strength' => $batch->strength_display,
                'expiry_date' => $batch->expiry_date, // Fixed: format date
                'unit_price' => $priceInCents,
                'unit_price_display' => $this->formatPrice($priceInCents),
                'quantity' => $request->quantity,
                'available' => $batch->available_quantity,
                'total_price' => $request->quantity * $priceInCents,
                'total_price_display' => $this->formatPrice($request->quantity * $priceInCents)
            ];
        }

        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully',
            'cart_count' => count($cart),
            'cart' => $cart,
            'subtotal' => $this->formatPrice(collect($cart)->sum('total_price')),
            'total' => $this->formatPrice(collect($cart)->sum('total_price'))
        ]);
    }

    public function updateCart(Request $request)
    {
        $request->validate([
            'index' => 'required|integer',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = session()->get('cart', []);

        if (!isset($cart[$request->index])) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart'
            ], 404);
        }

        if ($request->quantity > $cart[$request->index]['available']) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock'
            ], 422);
        }

        $cart[$request->index]['quantity'] = $request->quantity;
        $cart[$request->index]['total_price'] = $request->quantity * $cart[$request->index]['unit_price'];
        $cart[$request->index]['total_price_display'] = $this->formatPrice($request->quantity * $cart[$request->index]['unit_price']);

        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated',
            'cart' => $cart,
            'cart_count' => count($cart),
            'subtotal' => $this->formatPrice(collect($cart)->sum('total_price')),
            'total' => $this->formatPrice(collect($cart)->sum('total_price'))
        ]);
    }

    public function removeFromCart($index)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$index])) {
            unset($cart[$index]);
            $cart = array_values($cart); // Reindex array
            session()->put('cart', $cart);

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart',
                'cart' => $cart,
                'cart_count' => count($cart),
                'subtotal' => $this->formatPrice(collect($cart)->sum('total_price')),
                'total' => $this->formatPrice(collect($cart)->sum('total_price'))
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Item not found in cart'
        ], 404);
    }

    public function clearCart()
    {
        session()->forget('cart');

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared',
            'cart' => [],
            'cart_count' => 0,
            'subtotal' => '0 Kyat',
            'total' => '0 Kyat'
        ]);
    }

    public function getCart()
    {
        $cart = session()->get('cart', []);

        return response()->json([
            'success' => true,
            'cart' => $cart,
            'cart_count' => count($cart),
            'subtotal' => $this->formatPrice(collect($cart)->sum('total_price')),
            'total' => $this->formatPrice(collect($cart)->sum('total_price'))
        ]);
    }

    public function getCartCount()
    {
        $cart = session()->get('cart', []);

        return response()->json([
            'count' => count($cart)
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string'
        ]);

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Calculate totals
            $subtotal = collect($cart)->sum('total_price');
            $total = $subtotal;

            // Create sale
            $sale = Sale::create([
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'subtotal' => $subtotal,
                'total' => $total,
                'notes' => $request->notes
            ]);

            // Create sale items and update stock
            foreach ($cart as $item) {
                $batch = Batch::find($item['batch_id']);

                // Final stock check
                if (!$batch || $batch->available_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$item['medicine_name']}");
                }

                // Create sale item
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'medicine_id' => $item['medicine_id'],
                    'batch_id' => $item['batch_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price']
                ]);

                // Reduce batch stock
                $batch->available_quantity -= $item['quantity'];
                $batch->save();
            }

            // Clear cart
            session()->forget('cart');

            DB::commit();

            // Load sale with items for receipt
            $sale->load('saleItems');

            return response()->json([
                'success' => true,
                'message' => 'Sale completed successfully!',
                'sale' => [
                    'invoice_number' => $sale->invoice_number,
                    'customer_name' => $sale->customer_name,
                    'total' => $this->formatPrice($sale->total),
                    'items' => $sale->saleItems->map(function($item) {
                        return [
                            'medicine_name' => $item->medicine->name,
                            'quantity' => $item->quantity,
                            'unit_price' => $this->formatPrice($item->unit_price),
                            'total_price' => $this->formatPrice($item->total_price)
                        ];
                    })
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Checkout failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function formatPrice($cents)
    {
        return $cents . ' Kyat';
    }
}
