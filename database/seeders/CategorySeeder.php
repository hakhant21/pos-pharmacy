<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $categories = [
            ['name' => 'Pain Relief'],
            ['name' => 'Antibiotics'],
            ['name' => 'Vitamins'],
            ['name' => 'Cold & Flu'],
            ['name' => 'Allergy'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
