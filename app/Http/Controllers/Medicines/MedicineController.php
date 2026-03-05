<?php

namespace App\Http\Controllers\Medicines;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Medicine;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MedicineController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicine::with(['category', 'batches' => function ($q) {
            $q->where('expiry_date', '>', now())
                ->where('available_quantity', '>', 0)
                ->orderBy('expiry_date');
        }])->where('is_active', true);

        if ($request->has('search') && !empty($request->search)) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('generic_name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category_id', $request->category);
        }

        $medicines = $query->paginate(10)->through(function ($medicine) {
            return [
                'id' => $medicine->id,
                'name' => $medicine->name,
                'generic_name' => $medicine->generic_name,
                'category' => $medicine->category ? $medicine->category->name : 'Uncategorized',
                'total_stock' => $medicine->batches->sum('available_quantity'),
                'batch_count' => $medicine->batches->count(),
                'batches' => $medicine->batches->map(function ($batch) {
                    return [
                        'id' => $batch->id,
                        'strength' => $batch->strength,
                        'strength_unit' => $batch->strength_unit,
                        'strength_display' => $batch->strength_display,
                        'expiry_date' => $batch->expiry_date,
                        'expiry_raw' => $batch->expiry_date,
                        'selling_price' => $batch->selling_price,
                        'price_in_cents' => $batch->selling_price_in_cents,
                        'available_quantity' => $batch->available_quantity,
                        'days_to_expiry' => $batch->days_to_expiry,
                        'is_expiring_soon' => $batch->days_to_expiry <= 60
                    ];
                })
            ];
        });

        $categories = Category::where('is_active', true)->get(['id', 'name']);

        // Get Sales Summary Data
        $today = Carbon::today();

        // Today's sales
        $todaySales = Sale::whereDate('created_at', $today)->count();
        $todayRevenue = Sale::whereDate('created_at', $today)->sum('total') / 100; // Convert cents to dollars

        // Total sales (all time)
        $totalSales = Sale::count();
        $totalItemsSold = SaleItem::sum('quantity');
        $totalRevenue = Sale::sum('total') / 100; // Convert cents to dollars

        // Average order value
        $averageOrderValue = $totalSales > 0 ? $totalRevenue / $totalSales : 0;

        // Recent sales with items
        $recentSales = Sale::with(['saleItems' => function ($q) {
            $q->select('sale_id', 'medicine_id', 'quantity', 'unit_price', 'total_price');
        }])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_no' => $sale->invoice_number,
                    'customer' => $sale->customer_name ?? 'Walk-in Customer',
                    'items' => $sale->saleItems->count(),
                    'total_items' => $sale->saleItems->sum('quantity'),
                    'total' => $sale->total, // Convert cents to dollars
                    'date' => $sale->created_at,
                ];
            });

        // Top selling medicines today - Fixed column names to match your schema
        $topSellingToday = SaleItem::select('medicine_id')
            ->selectRaw('SUM(quantity) as total_quantity, SUM(total_price) as total_revenue')
            ->whereHas('sale', function ($q) use ($today) {
                $q->whereDate('created_at', $today);
            })
            ->with('medicine:id,name')
            ->groupBy('medicine_id')
            ->orderBy('total_quantity', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'medicine_id' => $item->medicine_id,
                    'medicine_name' => $item->medicine->name ?? 'Unknown',
                    'quantity' => $item->total_quantity,
                    'revenue' => $item->total_revenue
                ];
            });

        $salesSummary = [
            'total_sales' => $totalSales,
            'total_items_sold' => $totalItemsSold,
            'total_revenue' => $totalRevenue,
            'average_order_value' => $averageOrderValue,
            'today_sales' => $todaySales,
            'today_revenue' => $todayRevenue,
            'recent_sales' => $recentSales,
            'top_selling_today' => $topSellingToday,
        ];

        
        return Inertia::render('Medicines/Index', [
            'medicines' => $medicines,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
            'salesSummary' => $salesSummary
        ]);
    }

    public function getBatches($id)
    {
        $medicine = Medicine::with(['batches' => function ($q) {
            $q->where('expiry_date', '>', now())
                ->where('available_quantity', '>', 0)
                ->orderBy('expiry_date');
        }])->findOrFail($id);

        return response()->json([
            'id' => $medicine->id,
            'name' => $medicine->name,
            'batches' => $medicine->batches->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'strength_display' => $batch->strength_display,
                    'expiry_date' => $batch->expiry_date,
                    'selling_price' => $batch->selling_price,
                    'price_in_cents' => $batch->selling_price_in_cents,
                    'available_quantity' => $batch->available_quantity,
                    'days_to_expiry' => $batch->days_to_expiry
                ];
            })
        ]);
    }
}
