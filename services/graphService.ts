
import { GraphNode, GraphLink } from '../types';

export const generateWattsStrogatzGraph = (N: number, K: number, p: number, mode: 'rewire' | 'add'): { nodes: GraphNode[], links: GraphLink[] } => {
    const nodes: GraphNode[] = Array.from({ length: N }, (_, i) => ({ id: i }));
    const links: GraphLink[] = [];
    const edges = new Set<string>();

    // 1. Create a regular ring lattice
    for (let i = 0; i < N; i++) {
        for (let j = 1; j <= K / 2; j++) {
            const target = (i + j) % N;
            const sourceId = i;
            const targetId = target;
            const edgeKey1 = `${sourceId}-${targetId}`;
            const edgeKey2 = `${targetId}-${sourceId}`;

            if (!edges.has(edgeKey1) && !edges.has(edgeKey2)) {
                links.push({ source: sourceId, target: targetId });
                edges.add(edgeKey1);
            }
        }
    }

    if (mode === 'rewire') {
        // 2. Rewire edges with probability p
        for (const link of links) {
            if (Math.random() < p) {
                const sourceId = (link.source as GraphNode).id ?? link.source as number;
                const originalTargetId = (link.target as GraphNode).id ?? link.target as number;
                
                let newTargetId: number;
                let isDuplicateOrSelfLoop: boolean;

                do {
                    newTargetId = Math.floor(Math.random() * N);
                    const edgeKey1 = `${sourceId}-${newTargetId}`;
                    const edgeKey2 = `${newTargetId}-${sourceId}`;
                    isDuplicateOrSelfLoop = newTargetId === sourceId || edges.has(edgeKey1) || edges.has(edgeKey2);
                } while (isDuplicateOrSelfLoop);

                const oldEdgeKey1 = `${sourceId}-${originalTargetId}`;
                const oldEdgeKey2 = `${originalTargetId}-${sourceId}`;
                edges.delete(oldEdgeKey1);
                edges.delete(oldEdgeKey2);
                
                const newEdgeKey1 = `${sourceId}-${newTargetId}`;
                edges.add(newEdgeKey1);

                link.target = newTargetId;
            }
        }
    } else { // mode === 'add'
        // 2. Add shortcut edges with probability p (Newman-Watts model)
        const originalLinks = [...links]; // Iterate over a snapshot of original links
        for (const link of originalLinks) {
            if (Math.random() < p) {
                const sourceId = (link.source as GraphNode).id ?? link.source as number;
                
                let newTargetId: number;
                let isDuplicateOrSelfLoop: boolean;
                let attempts = 0;
                const maxAttempts = N; // Failsafe for dense graphs

                do {
                    newTargetId = Math.floor(Math.random() * N);
                    const edgeKey1 = `${sourceId}-${newTargetId}`;
                    const edgeKey2 = `${newTargetId}-${sourceId}`;
                    isDuplicateOrSelfLoop = newTargetId === sourceId || edges.has(edgeKey1) || edges.has(edgeKey2);
                    attempts++;
                } while (isDuplicateOrSelfLoop && attempts < maxAttempts);

                if (!isDuplicateOrSelfLoop) {
                    const newEdgeKey = `${sourceId}-${newTargetId}`;
                    links.push({ source: sourceId, target: newTargetId });
                    edges.add(newEdgeKey);
                }
            }
        }
    }


    return { nodes, links };
};

const bfs = (startNodeId: number, adj: Map<number, number[]>): Map<number, number> => {
    const distances = new Map<number, number>();
    const queue: number[] = [startNodeId];
    distances.set(startNodeId, 0);

    let head = 0;
    while(head < queue.length) {
        const u = queue[head++];
        const neighbors = adj.get(u) || [];
        for (const v of neighbors) {
            if (!distances.has(v)) {
                distances.set(v, distances.get(u)! + 1);
                queue.push(v);
            }
        }
    }
    return distances;
}

export const calculateMetrics = (nodes: GraphNode[], links: GraphLink[]) => {
    if (nodes.length === 0) {
        return { avgPathLength: 0, clusteringCoeff: 0 };
    }

    const adj = new Map<number, number[]>();
    nodes.forEach(node => adj.set(node.id, []));
    links.forEach(link => {
        const sourceId = (link.source as GraphNode).id ?? link.source as number;
        const targetId = (link.target as GraphNode).id ?? link.target as number;
        adj.get(sourceId)!.push(targetId);
        adj.get(targetId)!.push(sourceId);
    });

    // Average Path Length
    let totalPathLength = 0;
    let pathCount = 0;
    for (let i = 0; i < nodes.length; i++) {
        const startNodeId = nodes[i].id;
        const distances = bfs(startNodeId, adj);
        for(const [nodeId, dist] of distances.entries()) {
            if (nodeId > startNodeId) {
                totalPathLength += dist;
                pathCount++;
            }
        }
    }
    const avgPathLength = pathCount > 0 ? totalPathLength / pathCount : 0;

    // Clustering Coefficient
    let totalClusteringCoeff = 0;
    for (const node of nodes) {
        const neighbors = adj.get(node.id)!;
        const k = neighbors.length;
        if (k < 2) continue;

        let triangleCount = 0;
        for (let i = 0; i < k; i++) {
            for (let j = i + 1; j < k; j++) {
                const neighbor1 = neighbors[i];
                const neighbor2 = neighbors[j];
                if (adj.get(neighbor1)!.includes(neighbor2)) {
                    triangleCount++;
                }
            }
        }
        const possibleEdges = k * (k - 1) / 2;
        totalClusteringCoeff += triangleCount / possibleEdges;
    }
    const clusteringCoeff = totalClusteringCoeff / nodes.length;

    return { avgPathLength, clusteringCoeff };
};