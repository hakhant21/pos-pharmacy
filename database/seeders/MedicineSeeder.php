<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $medicines = [
            [
                'category_id' => 1,
                'name' => 'Paracetamol'
            ],
            [
                'category_id' => 1,
                'name' => 'Ibuprofen'
            ],
            [
                'category_id' => 2,
                'name' => 'Amoxicillin'
            ],
            [
                'category_id' => 3,
                'name' => 'Vitamin C'
            ],
            [
                'category_id' => 4,
                'name' => 'Cetirizine'
            ],
        ];

        foreach ($medicines as $med) {
            Medicine::create($med);
        }
    }
}
