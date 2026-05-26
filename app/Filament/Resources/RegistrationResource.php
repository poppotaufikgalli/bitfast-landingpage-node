<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RegistrationResource\Pages;
use App\Models\Registration;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class RegistrationResource extends Resource
{
    protected static ?string $model = Registration::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Pendaftaran Lead';

    protected static ?string $modelLabel = 'Pendaftaran Lead';

    protected static ?string $pluralModelLabel = 'Pendaftaran Lead';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Data Pendaftar')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('phone')
                            ->label('Nomor Telepon / WA')
                            ->tel()
                            ->required()
                            ->maxLength(255),

                        Forms\Components\Select::make('package_id')
                            ->label('Pilihan Paket')
                            ->relationship('package', 'name')
                            ->nullable()
                            ->searchable(),

                        Forms\Components\Textarea::make('address')
                            ->label('Alamat Pemasangan')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Proses Follow Up')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Status Leads')
                            ->options([
                                'pending' => 'Pending (Baru Masuk)',
                                'contacted' => 'Contacted (Dihubungi)',
                                'surveyed' => 'Surveyed (Proses Survei Lokasi)',
                                'installed' => 'Installed (Sudah Terpasang & Aktif)',
                                'rejected' => 'Rejected (Batal / Tidak Tercover)',
                            ])
                            ->required()
                            ->default('pending'),

                        Forms\Components\Textarea::make('notes')
                            ->label('Catatan Admin')
                            ->placeholder('Masukkan catatan perkembangan proses instalasi / kendala...')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tgl Masuk')
                    ->dateTime('d M Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Lengkap')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Telepon / WA')
                    ->searchable(),

                Tables\Columns\TextColumn::make('package.name')
                    ->label('Pilihan Paket')
                    ->placeholder('Tanpa Paket / Custom')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'contacted' => 'info',
                        'surveyed' => 'primary',
                        'installed' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Pending',
                        'contacted' => 'Contacted',
                        'surveyed' => 'Surveyed',
                        'installed' => 'Installed',
                        'rejected' => 'Rejected',
                        default => $state,
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('notes')
                    ->label('Catatan')
                    ->limit(30)
                    ->tooltip(fn (Registration $record): string => $record->notes ?? ''),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'contacted' => 'Contacted',
                        'surveyed' => 'Surveyed',
                        'installed' => 'Installed',
                        'rejected' => 'Rejected',
                    ]),
                Tables\Filters\SelectFilter::make('package_id')
                    ->label('Paket')
                    ->relationship('package', 'name'),
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
            'index' => Pages\ListRegistrations::route('/'),
            'create' => Pages\CreateRegistration::route('/create'),
            'edit' => Pages\EditRegistration::route('/{record}/edit'),
        ];
    }
}
