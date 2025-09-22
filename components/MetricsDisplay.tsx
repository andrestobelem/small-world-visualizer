
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricHistoryPoint } from '../types';

interface MetricsDisplayProps {
    metrics: { avgPathLength: number; clusteringCoeff: number; };
    metricsHistory: MetricHistoryPoint[];
    isLoading: boolean;
}

const MetricItem: React.FC<{ label: string; value: string | number; tooltip: string; isLoading: boolean }> = ({ label, value, tooltip, isLoading }) => (
    <div className="relative group p-3 bg-slate-700/50 rounded-lg text-center">
        <h3 className="text-sm font-semibold text-gray-400">{label}</h3>
        <div className="text-2xl font-bold text-cyan-400 mt-1">
            {isLoading ? (
                <div className="h-8 bg-slate-600 rounded w-20 mx-auto animate-pulse"></div>
            ) : (
                <span>{value}</span>
            )}
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs bg-gray-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
            {tooltip}
        </div>
    </div>
);

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics, isLoading, metricsHistory }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 border-b border-slate-600 pb-2">Métricas de la Red</h2>
            <div className="grid grid-cols-2 gap-3">
                <MetricItem 
                    label="Long. Media de Camino"
                    value={metrics.avgPathLength.toFixed(3)}
                    tooltip="El número promedio de pasos en los caminos más cortos para todos los pares de nodos posibles en la red."
                    isLoading={isLoading}
                />
                <MetricItem 
                    label="Coef. de Agrupamiento"
                    value={metrics.clusteringCoeff.toFixed(3)}
                    tooltip="Una medida del grado en que los nodos de un grafo tienden a agruparse."
                    isLoading={isLoading}
                />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
                <h3 className="text-md font-semibold text-cyan-400/90 mb-3 text-center">
                    Métricas vs. Reconexión (p)
                </h3>
                {metricsHistory.length > 1 ? (
                     <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={metricsHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#475569" />
                            <XAxis 
                                dataKey="p" 
                                type="number" 
                                domain={[0, 1]} 
                                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                axisLine={{ stroke: '#64748b' }}
                                tickLine={{ stroke: '#64748b' }}
                                tickFormatter={(tick) => tick.toFixed(1)}
                            />
                            <YAxis 
                                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                axisLine={{ stroke: '#64748b' }}
                                tickLine={{ stroke: '#64748b' }}
                                tickFormatter={(tick) => typeof tick === 'number' ? tick.toFixed(1) : tick}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                    borderColor: '#475569',
                                    borderRadius: '0.5rem',
                                }}
                                itemStyle={{ fontWeight: '500' }}
                                labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                                formatter={(value: number, name: string) => [value.toFixed(3), name]}
                                labelFormatter={(label) => `p = ${label.toFixed(2)}`}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Line 
                                type="monotone" 
                                dataKey="clusteringCoeff" 
                                name="Agrupamiento"
                                stroke="#2dd4bf" 
                                strokeWidth={2}
                                dot={{ r: 2 }}
                                activeDot={{ r: 5, stroke: '#111827', strokeWidth: 2 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="avgPathLength" 
                                name="Long. de Camino"
                                stroke="#f472b6"
                                strokeWidth={2}
                                dot={{ r: 2 }}
                                activeDot={{ r: 5, stroke: '#111827', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center text-sm text-gray-500 h-[200px] flex items-center justify-center">
                        <p>Mueve el deslizador de 'Probabilidad de Reconexión'<br/> para ver la tendencia.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricsDisplay;
