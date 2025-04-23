<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EvaluacionPolinizacionResource\Pages;
use App\Filament\Resources\EvaluacionPolinizacionResource\RelationManagers;
use App\Models\EvaluacionPolinizacion;
use App\Models\EvaluacionGeneral;
use App\Models\Usuario;
use App\Models\Operario;
use App\Models\Lote;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class EvaluacionPolinizacionResource extends Resource
{
    protected static ?string $model = EvaluacionPolinizacion::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';
    
    protected static ?string $navigationGroup = 'Evaluaciones';
    
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('evaluaciongeneralid')
                    ->label('Evaluación General')
                    ->options(EvaluacionGeneral::all()->pluck('id', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
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
                Forms\Components\TextInput::make('ubicacion')
                    ->label('Ubicación')
                    ->maxLength(255),
                Forms\Components\Select::make('idevaluador')
                    ->label('Evaluador')
                    ->options(Usuario::where('tipo_rol', 'evaluador')->orWhere('tipo_rol', 'coordinador')->orWhere('tipo_rol', 'administrador')->pluck('nombre', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\Select::make('idpolinizador')
                    ->label('Operario')
                    ->options(Operario::where('activo', 1)->pluck('nombre', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\Select::make('idlote')
                    ->label('Lote')
                    ->options(Lote::all()->pluck('descripcion', 'id'))
                    ->searchable()
                    ->required()
                    ->preload(),
                Forms\Components\TextInput::make('seccion')
                    ->label('Sección')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('palma')
                    ->label('Palma')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('inflorescencia')
                    ->label('Inflorescencia')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('antesis')
                    ->label('Antesis')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('antesisDejadas')
                    ->label('Antesis Dejadas')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('postantesisDejadas')
                    ->label('Postantesis Dejadas')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('postantesis')
                    ->label('Postantesis')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('espate')
                    ->label('Espate')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('aplicacion')
                    ->label('Aplicación')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('marcacion')
                    ->label('Marcación')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('repaso1')
                    ->label('Repaso 1')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('repaso2')
                    ->label('Repaso 2')
                    ->numeric()
                    ->required(),
                Forms\Components\Textarea::make('observaciones')
                    ->label('Observaciones')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('evaluaciongeneralid')
                    ->label('Evaluación General')
                    ->sortable(),
                Tables\Columns\TextColumn::make('fecha')
                    ->label('Fecha')
                    ->date('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('hora')
                    ->label('Hora')
                    ->time('H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('semana')
                    ->label('Semana')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('ubicacion')
                    ->label('Ubicación')
                    ->searchable(),
                Tables\Columns\TextColumn::make('evaluador.nombre')
                    ->label('Evaluador')
                    ->sortable(),
                Tables\Columns\TextColumn::make('polinizador.nombre')
                    ->label('Operario')
                    ->sortable(),
                Tables\Columns\TextColumn::make('lote.descripcion')
                    ->label('Lote')
                    ->sortable(),
                Tables\Columns\TextColumn::make('seccion')
                    ->label('Sección')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('palma')
                    ->label('Palma')
                    ->numeric()
                    ->sortable(),
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
            'index' => Pages\ListEvaluacionPolinizacions::route('/'),
            'create' => Pages\CreateEvaluacionPolinizacion::route('/create'),
            'edit' => Pages\EditEvaluacionPolinizacion::route('/{record}/edit'),
        ];
    }
}
