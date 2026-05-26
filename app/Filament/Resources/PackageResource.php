<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackageResource\Pages;
use App\Models\Package;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PackageResource extends Resource
{
    protected static ?string $model = Package::class;

    protected static ?string $navigationIcon = 'heroicon-o-wifi';

    protected static ?string $navigationLabel = 'Paket Internet';

    protected static ?string $modelLabel = 'Paket Internet';

    protected static ?string $pluralModelLabel = 'Paket Internet';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Paket')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Paket')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => 
                                $operation === 'create' ? $set('slug', Str::slug($state)) : null
                            ),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug URL')
                            ->required()
                            ->unique(Package::class, 'slug', ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('speed')
                            ->label('Kecepatan (e.g. 50 Mbps)')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('price')
                            ->label('Harga Bulanan')
                            ->required()
                            ->numeric()
                            ->prefix('Rp'),

                        Forms\Components\Select::make('category')
                            ->label('Kategori')
                            ->options([
                                'home' => 'Home / Residensial',
                                'business' => 'Business / Perusahaan',
                            ])
                            ->required(),
                    ])->columns(2),

                Forms\Components\Section::make('Fitur & Status')
                    ->schema([
                        Forms\Components\Repeater::make('features')
                            ->label('Fitur Paket')
                            ->simple(
                                Forms\Components\TextInput::make('feature')
                                    ->placeholder('e.g. Kuota Unlimited')
                                    ->required(),
                            )
                            ->createItemButtonLabel('Tambah Fitur')
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('is_popular')
                            ->label('Tampilkan Badge Populer')
                            ->default(false),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif / Tampilkan')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Paket')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('speed')
                    ->label('Kecepatan')
                    ->sortable(),

                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR', locale: 'id')
                    ->sortable(),

                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'home' => 'Home',
                        'business' => 'Business',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'home' => 'info',
                        'business' => 'success',
                        default => 'gray',
                    }),

                Tables\Columns\IconColumn::make('is_popular')
                    ->label('Populer')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Status Aktif')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->label('Kategori')
                    ->options([
                        'home' => 'Home',
                        'business' => 'Business',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPackages::route('/'),
            'create' => Pages\CreatePackage::route('/create'),
            'edit' => Pages\EditPackage::route('/{record}/edit'),
        ];
    }
}
