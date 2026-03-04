<?php

namespace App\Filament\Resources\Batches\Schemas;

use App\Models\Medicine;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class BatchForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('medicine_id')
                    ->options(Medicine::query()->pluck('name', 'id'))
                    ->searchable()
                    ->required(),
                Select::make('strength_unit')
                    ->options(['MG', 'ML', 'MCG', 'IU']),
                TextInput::make('strength')
                    ->required()
                    ->numeric(),
                DatePicker::make('expiry_date')
                    ->required(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric(),
                TextInput::make('available_quantity')
                    ->required()
                    ->numeric(),
                TextInput::make('purchase_price')
                    ->required()
                    ->numeric()
                    ->suffix('Kyat'),
                TextInput::make('selling_price')
                    ->required()
                    ->numeric()
                    ->suffix('Kyat')
            ]);
    }
}
