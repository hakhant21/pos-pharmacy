<?php

namespace App\Filament\Resources\Medicines\Schemas;

use App\Models\Category;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class MedicineForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->options(Category::query()->pluck('name', 'id'))
                    ->searchable()
                    ->required(),
                TextInput::make('name')->required(),
                Toggle::make('is_active')->default(true),
            ]);
    }
}
