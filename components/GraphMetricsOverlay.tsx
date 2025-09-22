import React from 'react';

interface GraphMetricsOverlayProps {
    metrics: { avgPathLength: number; clusteringCoeff: number; };
    isLoading: boolean;
}

const MetricItem: React.FC<{ label: string; value: string | number; isLoading: boolean }> = ({ label, value, isLoading }) => (
    <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</h3>
        <div className="text-xl font-bold text-cyan-300 mt-1">
            {isLoading ? (
                <div className="h-7 bg-slate-600 rounded w-20 animate-pulse"></div>
            ) : (
                <span>{value}</span>
            )}
        </div>
    </div>
);


const GraphMetricsOverlay: React.FC<GraphMetricsOverlayProps> = ({ metrics, isLoading }) => {
    return (
        <div className="absolute top-4 left-4 bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-700 z-10">
            <div className="flex items-center gap-6 flex-wrap">
                <MetricItem 
                    label="Camino Medio"
                    value={metrics.avgPathLength.toFixed(3)}
                    isLoading={isLoading}
                />
                <MetricItem 
                    label="Agrupamiento"
                    value={metrics.clusteringCoeff.toFixed(3)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default GraphMetricsOverlay;