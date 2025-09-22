import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GraphData } from './types';
import ControlPanel from './components/ControlPanel';
import GraphVisualizer from './components/GraphVisualizer';
import GraphMetricsOverlay from './components/GraphMetricsOverlay';
import { generateWattsStrogatzGraph, calculateMetrics } from './services/graphService';
import HelpModal from './components/HelpModal';

const DEFAULT_N = 40;
const DEFAULT_K = 4;
const DEFAULT_P = 0.2;

type AppParams = {
    N: number;
    K: number;
    p: number;
    reconnectionMode: 'rewire' | 'add';
};

const App: React.FC = () => {
    const [params, setParams] = useState<AppParams>({
        N: DEFAULT_N,
        K: DEFAULT_K,
        p: DEFAULT_P,
        reconnectionMode: 'rewire',
    });
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [metrics, setMetrics] = useState({ avgPathLength: 0, clusteringCoeff: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const memoizedGraphData = useMemo(() => graphData, [graphData]);

    const handleGenerateGraph = useCallback(async (newParams: AppParams) => {
        setIsLoading(true);
        setGraphData({ nodes: [], links: [] }); 
        setMetrics({ avgPathLength: 0, clusteringCoeff: 0 });

        await new Promise(resolve => setTimeout(resolve, 50));
        
        const newGraphData = generateWattsStrogatzGraph(newParams.N, newParams.K, newParams.p, newParams.reconnectionMode);
        setGraphData(newGraphData);

        const newMetrics = calculateMetrics(newGraphData.nodes, newGraphData.links);
        setMetrics(newMetrics);

        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        handleGenerateGraph(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onParamsChange = (newParams: AppParams) => {
        setParams(newParams);
        handleGenerateGraph(newParams);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-200 flex flex-col p-4 lg:p-6 font-sans relative">
            <header className="text-center mb-4 relative">
                <h1 className="text-3xl lg:text-4xl font-bold text-cyan-400 tracking-tight">
                    Visualizador de Redes de Mundo Pequeño
                </h1>
                <p className="text-gray-400 mt-1 max-w-2xl mx-auto">
                    Explora el modelo de Watts-Strogatz y cómo emergen las redes complejas.
                </p>
                <div className="absolute top-0 right-0">
                    <button 
                        onClick={() => setIsHelpModalOpen(true)}
                        className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label="Abrir guía de ayuda"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
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
            <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        </div>
    );
};

export default App;