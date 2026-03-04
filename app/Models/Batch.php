<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $guarded = [];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

     public function scopeActive($query)
    {
        return $query->where('expiry_date', '>', now())
            ->where('available_quantity', '>', 0);
    }

     public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now())
            ->where('available_quantity', '>', 0);
    }

     public function scopeExpiringSoon($query, $days = 60)
    {
        return $query->whereBetween('expiry_date', [now(), now()->addDays($days)])
            ->where('available_quantity', '>', 0);
    }

    public function getIsExpiredAttribute()
    {
        return $this->expiry_date ? $this->expiry_date < now() : false;
    }

    public function getDaysToExpiryAttribute()
    {
        return $this->expiry_date ? now()->diffInDays($this->expiry_date, false) : null;
    }

    public function getIsExpiringSoonAttribute()
    {
        return $this->days_to_expiry <= 60 && $this->days_to_expiry > 0;
    }

    public function getStrengthDisplayAttribute()
    {
        return $this->strength . ' ' . $this->strength_unit;
    }

    // Methods
    public function hasStock($quantity = 1)
    {
        return !$this->is_expired && $this->available_quantity >= $quantity;
    }

    public function reduceStock($quantity)
    {
        if ($this->hasStock($quantity)) {
            $this->available_quantity -= $quantity;
            $this->save();
            return true;
        }
        return false;
    }
}
