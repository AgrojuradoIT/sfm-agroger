<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OperarioResource\Pages;
use App\Filament\Resources\OperarioResource\RelationManagers;
use App\Models\Operario;
use App\Models\Cargo;
use App\Models\Area;
use App\Models\Finca;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OperarioResource extends Resource
{
    protected static ?string $model = Operario::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    
    protected static ?string $navigationGroup = 'Gestión de Personal';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('codigo')
                    ->label('Código')
                    ->required()
                    ->maxLength(50),
                Forms\Components\TextInput::make('nombre')
                    ->label('Nombre')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('cargoId')
                    ->label('Cargo')
                    ->options(Cargo::all()->pluck('descripcion', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\Select::make('areaId')
                    ->label('Área')
                    ->options(Area::all()->pluck('descripcion', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\Select::make('fincaId')
                    ->label('Finca')
                    ->options(Finca::all()->pluck('descripcion', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\Toggle::make('activo')
                    ->label('Activo')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('codigo')
                    ->label('Código')
                    ->searchable(),
                Tables\Columns\TextColumn::make('nombre')
                    ->label('Nombre')
                    ->searchable(),
                Tables\Columns\TextColumn::make('cargo.descripcion')
                    ->label('Cargo')
                    ->sortable(),
                Tables\Columns\TextColumn::make('area.descripcion')
                    ->label('Área')
                    ->sortable(),
                Tables\Columns\TextColumn::make('finca.descripcion')
                    ->label('Finca')
                    ->sortable(),
                Tables\Columns\IconColumn::make('activo')
                    ->label('Activo')
                    ->boolean(),
            ])
            ->filters([
                //
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
            'index' => Pages\ListOperarios::route('/'),
            'create' => Pages\CreateOperario::route('/create'),
            'edit' => Pages\EditOperario::route('/{record}/edit'),
        ];
    }
}
