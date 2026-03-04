<?php

namespace Database\Seeders;

use App\Models\Batch;
use Illuminate\Database\Seeder;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $batches = [
            // Paracetamol batches
            [
                'medicine_id' => 1,
                'strength' => 500,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(8),
                'quantity' => 500,
                'available_quantity' => 500,
                'purchase_price' => 2000,
                'selling_price' => 3000
            ],
            [
                'medicine_id' => 1,
                'strength' => 250,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(10),
                'quantity' => 400,
                'available_quantity' => 400,
                'purchase_price' => 1000,
                'selling_price' => 2000
            ],
            [
                'medicine_id' => 1,
                'strength' => 100,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(6),
                'quantity' => 300,
                'available_quantity' => 300,
                'purchase_price' => 5000,
                'selling_price' => 6000
            ],

            // Ibuprofen batches
            [
                'medicine_id' => 2,
                'strength' => 400,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(9),
                'quantity' => 300,
                'available_quantity' => 300,
                'purchase_price' => 3600,
                'selling_price' => 4000
            ],
            [
                'medicine_id' => 2,
                'strength' => 200,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(7),
                'quantity' => 250,
                'available_quantity' => 250,
                'purchase_price' => 2550,
                'selling_price' => 3000
            ],

            // Amoxicillin batches
            [
                'medicine_id' => 3,
                'strength' => 500,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(12),
                'quantity' => 200,
                'available_quantity' => 200,
                'purchase_price' => 5000,
                'selling_price' => 10000
            ],

            // Vitamin C batches
            [
                'medicine_id' => 4,
                'strength' => 1000,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(15),
                'quantity' => 600,
                'available_quantity' => 600,
                'purchase_price' => 3000,
                'selling_price' => 6000
            ],
            [
                'medicine_id' => 4,
                'strength' => 500,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(14),
                'quantity' => 500,
                'available_quantity' => 500,
                'purchase_price' => 2000,
                'selling_price' => 4000
            ],

            // Cetirizine batches
            [
                'medicine_id' => 5,
                'strength' => 10,
                'strength_unit' => 'MG',
                'expiry_date' => now()->addMonths(11),
                'quantity' => 350,
                'available_quantity' => 350,
                'purchase_price' => 4300,
                'selling_price' => 5000
            ],
        ];

        foreach ($batches as $batch) {
            Batch::create($batch);
        }

    }
}
