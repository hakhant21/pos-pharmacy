<x-filament-widgets::widget class="fi-wi-table">
    <x-filament::section collapsible heading="Pages">
        <x-filament::button icon="heroicon-o-shopping-bag" tag='a' :href="route('filament.admin.pages.dashboard')"
            color="secondary" label="Browse Medicines" outlined style="margin: 5px;">
            Dashboard
        </x-filament::button>

        <x-filament::button icon="heroicon-o-shopping-bag" tag='a' :href="route('medicines.index')" color="secondary"
            label="Browse Medicines" outlined style="margin: 5px;">
            Medicines
        </x-filament::button>

        <x-filament::button icon="heroicon-o-shopping-bag" tag='a' :href="route('cart')" color="secondary"
            label="Browse Medicines" outlined style="margin: 5px;">
            View Cart
        </x-filament::button>
    </x-filament::section>
</x-filament-widgets::widget>