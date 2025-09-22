
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GraphData } from './types';
import ControlPanel from './components/ControlPanel';
import GraphVisualizer from './components/GraphVisualizer';
import GraphMetricsOverlay from './components/GraphMetricsOverlay';
import { generateWattsStrogatzGraph, calculateMetrics } from './services/graphService';

const DEFAULT_N = 40;
const DEFAULT_K = 4;
const DEFAULT_P = 0.2;

const App: React.FC = () => {
    const [params, setParams] = useState({
        N: DEFAULT_N,
        K: DEFAULT_K,
        p: DEFAULT_P,
        reconnectionMode: 'rewire' as 'rewire' | 'add'
    });
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [metrics, setMetrics] = useState({ avgPathLength: 0, clusteringCoeff: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const memoizedGraphData = useMemo(() => graphData, [graphData]);

    const handleGenerateGraph = useCallback(async (newParams: { N: number; K: number; p: number; reconnectionMode: 'rewire' | 'add' }) => {
        setIsLoading(true);
        setMetrics({ avgPathLength: 0, clusteringCoeff: 0 });

        await new Promise(resolve => setTimeout(resolve, 50));
        const newGraphData = generateWattsStrogatzGraph(newParams.N, newParams.K, newParams.p, newParams.reconnectionMode);
        setGraphData(newGraphData);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        const newMetrics = calculateMetrics(newGraphData.nodes, newGraphData.links);
        setMetrics(newMetrics);
        
        setIsLoading(false);
    }, []);

    useEffect(() => {
        handleGenerateGraph(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onParamsChange = (newParams: { N: number; K: number; p: number; reconnectionMode: 'rewire' | 'add' }) => {
        setParams(newParams);
        handleGenerateGraph(newParams);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-200 flex flex-col p-4 lg:p-6 font-sans">
            <header className="text-center mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-cyan-400 tracking-tight">
                    Visualizador de Redes de Mundo Pequeño
                </h1>
                <p className="text-gray-400 mt-1 max-w-2xl mx-auto">
                    Explora el modelo de Watts-Strogatz ajustando los parámetros para ver la transición de una red regular a una red compleja.
                </p>
            </header>
            
            <div className="flex-grow flex flex-col lg:flex-row gap-4 lg:gap-6">
                <aside className="lg:w-1/4 xl:w-1/5 space-y-4">
                    <ControlPanel params={params} onParamsChange={onParamsChange} isLoading={isLoading} />
                </aside>

                <main className="flex-grow lg:w-3/4 xl:w-4/5 bg-gray-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-700 overflow-hidden relative">
                     <GraphMetricsOverlay metrics={metrics} isLoading={isLoading} />
                     <GraphVisualizer key={`${params.N}-${params.K}`} graphData={memoizedGraphData} />
                </main>
            </div>
        </div>
    );
};

export default App;