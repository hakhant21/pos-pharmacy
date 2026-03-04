<?php
// app/Http/Controllers/Medicines/MedicineController.php

namespace App\Http\Controllers\Medicines;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Medicine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicine::with(['category', 'batches' => function($q) {
            $q->where('expiry_date', '>', now())
              ->where('available_quantity', '>', 0)
              ->orderBy('expiry_date');
        }])->where('is_active', true);

        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('generic_name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category_id', $request->category);
        }

        $medicines = $query->paginate(10)->through(function($medicine) {
            return [
                'id' => $medicine->id,
                'name' => $medicine->name,
                'generic_name' => $medicine->generic_name,
                'category' => $medicine->category ? $medicine->category->name : 'Uncategorized',
                'total_stock' => $medicine->batches->sum('available_quantity'),
                'batch_count' => $medicine->batches->count(),
                'batches' => $medicine->batches->map(function($batch) {
                    return [
                        'id' => $batch->id,
                        'strength' => $batch->strength,
                        'strength_unit' => $batch->strength_unit,
                        'strength_display' => $batch->strength_display,
                        'expiry_date' => $batch->expiry_date, // Fixed: format date
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

        return Inertia::render('Medicines/Index', [
            'medicines' => $medicines,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']) // Fixed: include category in filters
        ]);
    }

    public function getBatches($id)
    {
        $medicine = Medicine::with(['batches' => function($q) {
            $q->where('expiry_date', '>', now())
              ->where('available_quantity', '>', 0)
              ->orderBy('expiry_date');
        }])->findOrFail($id);

        return response()->json([
            'id' => $medicine->id,
            'name' => $medicine->name,
            'batches' => $medicine->batches->map(function($batch) {
                return [
                    'id' => $batch->id,
                    'strength_display' => $batch->strength_display,
                    'expiry_date' => $batch->expiry_date, // Fixed: format date
                    'selling_price' => $batch->selling_price,
                    'price_in_cents' => $batch->selling_price_in_cents,
                    'available_quantity' => $batch->available_quantity,
                    'days_to_expiry' => $batch->days_to_expiry
                ];
            })
        ]);
    }
}
