<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getTotalStockAttribute()
    {
        return $this->batches()
            ->where('expiry_date', '>', now())
            ->sum('available_quantity');
    }

     public function getExpiringBatchesAttribute()
    {
        return $this->batches()
            ->whereBetween('expiry_date', [now(), now()->addDays(60)])
            ->where('available_quantity', '>', 0)
            ->get();
    }
}
