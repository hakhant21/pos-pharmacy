<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $guarded = [];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

     protected static function boot()
    {
        parent::boot();

        static::creating(function ($saleItem) {
            // Reduce batch stock
            $batch = Batch::find($saleItem->batch_id);
            if ($batch) {
                $batch->available_quantity -= $saleItem->quantity;
                $batch->save();
            }
        });
    }
}
