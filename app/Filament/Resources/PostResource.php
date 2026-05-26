<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Models\Post;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'Artikel Blog';

    protected static ?string $modelLabel = 'Artikel Blog';

    protected static ?string $pluralModelLabel = 'Artikel Blog';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Konten Artikel')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Judul Artikel')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(
                                fn(string $operation, $state, Forms\Set $set) =>
                                $operation === 'create' ? $set('slug', Str::slug($state)) : null
                            ),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug URL')
                            ->required()
                            ->unique(Post::class, 'slug', ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\Textarea::make('excerpt')
                            ->label('Ringkasan / Excerpt')
                            ->placeholder('Tulis ringkasan singkat artikel untuk preview halaman depan...')
                            ->rows(3)
                            ->maxLength(500)
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('content')
                            ->label('Isi Artikel')
                            ->required()
                            ->fileAttachmentsDirectory('blog-attachments')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Publikasi & Gambar')
                    ->schema([
                        Forms\Components\FileUpload::make('cover_image')
                            ->label('Gambar Sampul')
                            ->image()
                            ->directory('blog')
                            ->maxSize(2048)
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('is_published')
                            ->label('Terbitkan')
                            ->default(false)
                            ->live()
                            ->afterStateUpdated(
                                fn($state, Forms\Set $set) =>
                                $state ? $set('published_at', now()->toDateTimeString()) : $set('published_at', null)
                            ),

                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Tanggal Publikasi')
                            ->nullable(),

                        Forms\Components\Hidden::make('user_id')
                            ->default(fn() => auth()->id())
                            ->required(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->label('Sampul'),

                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->sortable()
                    ->wrap(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Penulis')
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_published')
                    ->label('Diterbitkan')
                    ->sortable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Tgl Terbit')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            // ->filters([
            //     Tables\Filters\ToggledFilter::make('is_published')
            //         ->label('Hanya Diterbitkan'),
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
            'index' => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit' => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
