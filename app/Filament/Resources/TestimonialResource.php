<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationLabel = 'Testimoni';

    protected static ?string $modelLabel = 'Testimoni';

    protected static ?string $pluralModelLabel = 'Testimoni';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Customer Review')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Customer')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('role_or_company')
                            ->label('Pekerjaan / Perusahaan')
                            ->placeholder('e.g. Rumah Tangga, Gamer, Owner Cafe')
                            ->maxLength(255),

                        Forms\Components\Select::make('rating')
                            ->label('Rating Bintang')
                            ->options([
                                5 => '⭐⭐⭐⭐⭐ (5 Bintang)',
                                4 => '⭐⭐⭐⭐ (4 Bintang)',
                                3 => '⭐⭐⭐ (3 Bintang)',
                                2 => '⭐⭐ (2 Bintang)',
                                1 => '⭐ (1 Bintang)',
                            ])
                            ->required()
                            ->default(5),

                        Forms\Components\Textarea::make('content')
                            ->label('Isi Testimoni')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Media & Status')
                    ->schema([
                        Forms\Components\FileUpload::make('avatar')
                            ->label('Foto Profil (Avatar)')
                            ->image()
                            ->directory('testimonials')
                            ->maxSize(1024)
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('is_featured')
                            ->label('Tampilkan Utama (Featured)')
                            ->default(false),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Status Aktif')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('avatar')
                    ->label('Foto')
                    ->circular(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('role_or_company')
                    ->label('Perusahaan / Pekerjaan')
                    ->searchable(),

                Tables\Columns\TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn(int $state): string => str_repeat('⭐', $state))
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Aktif')
                    ->sortable(),
            ])
            // ->filters([
            //     Tables\Filters\ToggledFilter::make('is_featured')
            //         ->label('Featured Saja'),
            // ])
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
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
