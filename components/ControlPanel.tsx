
import React from 'react';

type ReconnectionMode = 'rewire' | 'add';

interface ControlPanelProps {
    params: { N: number; K: number; p: number; reconnectionMode: ReconnectionMode };
    onParamsChange: (newParams: { N: number; K: number; p: number; reconnectionMode: ReconnectionMode }) => void;
    isLoading: boolean;
}

const Slider: React.FC<{ label: string; id: string; value: number; min: number; max: number; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; displayValue?: string; }> = ({ label, id, value, min, max, step, onChange, displayValue }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label htmlFor={id} className="font-medium text-gray-300 text-sm">{label}</label>
            <span className="text-sm font-mono bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded">
                {displayValue || value}
            </span>
        </div>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({ params, onParamsChange, isLoading }) => {
    
    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const N = parseInt(e.target.value, 10);
        const K = Math.min(params.K, N - 1);
        onParamsChange({ ...params, N, K });
    };

    const handleKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const K = parseInt(e.target.value, 10);
        onParamsChange({ ...params, K });
    };

    const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const p = parseFloat(e.target.value);
        onParamsChange({ ...params, p });
    };

    const handleModeChange = (mode: ReconnectionMode) => {
        onParamsChange({ ...params, reconnectionMode: mode });
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 border-b border-slate-600 pb-2">Controles</h2>
            <div className="space-y-5">
                <Slider 
                    label="Número de Nodos (N)"
                    id="nodes"
                    value={params.N}
                    min={10}
                    max={100}
                    step={1}
                    onChange={handleNChange}
                />
                <Slider 
                    label="Vecinos por Nodo (K)"
                    id="neighbors"
                    value={params.K}
                    min={2}
                    max={params.N > 1 ? params.N - 1 : 2}
                    step={2}
                    onChange={handleKChange}
                />
                <Slider 
                    label="Probabilidad de Reconexión (p)"
                    id="rewiring"
                    value={params.p}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handlePChange}
                    displayValue={params.p.toFixed(2)}
                />
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-600">
                <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-gray-300 text-sm">Modo de Reconexión</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleModeChange('rewire')}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
                            params.reconnectionMode === 'rewire' ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        Reconectar
                    </button>
                    <button
                        onClick={() => handleModeChange('add')}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
                            params.reconnectionMode === 'add' ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        Añadir
                    </button>
                </div>
            </div>

             {isLoading && (
                <div className="mt-4 text-center text-sm text-cyan-400 animate-pulse">
                    Generando y Analizando...
                </div>
            )}
        </div>
    );
};

export default ControlPanel;