<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EvaluacionGeneralResource\Pages;
use App\Filament\Resources\EvaluacionGeneralResource\RelationManagers;
use App\Models\EvaluacionGeneral;
use App\Models\Usuario;
use App\Models\Operario;
use App\Models\Lote;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class EvaluacionGeneralResource extends Resource
{
    protected static ?string $model = EvaluacionGeneral::class;
    protected static ?string $navigationIcon = 'heroicon-o-document-check';
    protected static ?string $navigationGroup = 'Evaluaciones';
    protected static ?int $navigationSort = 1;
    protected static bool $shouldRegisterNavigation = true;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('fecha')
                    ->label('Fecha')
                    ->required(),
                Forms\Components\TimePicker::make('hora')
                    ->label('Hora')
                    ->required(),
                Forms\Components\TextInput::make('semana')
                    ->label('Semana')
                    ->numeric()
                    ->required(),
                Forms\Components\Select::make('idevaluadorev')
                    ->label('Evaluador')
                    ->options(Usuario::where('tipo_rol', 'evaluador')->orWhere('tipo_rol', 'coordinador')->orWhere('tipo_rol', 'administrador')->pluck('nombre', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\Select::make('idpolinizadorev')
                    ->label('Operario')
                    ->options(Operario::where('activo', 1)->pluck('nombre', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\Select::make('idloteev')
                    ->label('Lote')
                    ->options(Lote::all()->pluck('descripcion', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\FileUpload::make('fotopath')
                    ->label('Foto')
                    ->image()
                    ->directory('evaluaciones-fotos')
                    ->visibility('public'),
                Forms\Components\FileUpload::make('firmapath')
                    ->label('Firma')
                    ->image()
                    ->directory('evaluaciones-firmas')
                    ->visibility('public'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('fecha')
                    ->label('Fecha')
                    ->searchable()
                    ->sortable()
                    ->html(false)
                    ->formatStateUsing(fn ($state) => $state)
                    ->extraAttributes(['class' => 'text-left']),
                Tables\Columns\TextColumn::make('hora')
                    ->label('Hora')
                    ->formatStateUsing(fn ($state) => $state)
                    ->sortable(),
                Tables\Columns\TextColumn::make('semana')
                    ->label('Semana')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('evaluador.nombre')
                    ->label('Evaluador')
                    ->sortable(),
                Tables\Columns\TextColumn::make('polinizador.nombre')
                    ->label('Operario')
                    ->sortable(),
                Tables\Columns\TextColumn::make('lote.descripcion')
                    ->label('Lote')
                    ->sortable(),
                Tables\Columns\ImageColumn::make('fotopath')
                    ->label('Foto'),
                Tables\Columns\ImageColumn::make('firmapath')
                    ->label('Firma'),
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
            'index' => Pages\ListEvaluacionGenerals::route('/'),
            'create' => Pages\CreateEvaluacionGeneral::route('/create'),
            'edit' => Pages\EditEvaluacionGeneral::route('/{record}/edit'),
        ];
    }
}
