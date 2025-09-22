import * as d3 from 'd3';

export interface GraphNode extends d3.SimulationNodeDatum {
    id: number;
    // FIX: Explicitly add optional x and y properties to resolve TypeScript errors in GraphVisualizer.
    // D3 simulation adds these properties, but the type inference seems to be failing.
    x?: number;
    y?: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    source: number | GraphNode;
    target: number | GraphNode;
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

// FIX: Add missing MetricHistoryPoint type to resolve import error in MetricsDisplay.tsx.
export interface MetricHistoryPoint {
    p: number;
    avgPathLength: number;
    clusteringCoeff: number;
}