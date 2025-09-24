import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, GraphNode, GraphLink } from '../types';

interface GraphVisualizerProps {
    graphData: GraphData;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ graphData }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerDivRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
    const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const hasInitializedZoom = useRef(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Observe parent size for responsiveness
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });

        const divElement = containerDivRef.current;
        if (divElement) {
            resizeObserver.observe(divElement);
        }

        return () => {
            if (divElement) {
                resizeObserver.unobserve(divElement);
            }
        };
    }, []);

    // One-time setup for SVG structure and simulation
    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        containerRef.current = svg.append("g");
        
        const linkGroup = containerRef.current.append("g")
            .attr("class", "links");

        const nodeGroup = containerRef.current.append("g")
            .attr("class", "nodes");

        const simulation = d3.forceSimulation<GraphNode>()
            .force('charge', d3.forceManyBody().strength(-100))
            .force('collide', d3.forceCollide().radius(12))
            .on("tick", () => {
                nodeGroup.selectAll<SVGCircleElement, GraphNode>("circle")
                    .attr("cx", d => d.x!)
                    .attr("cy", d => d.y!);

                linkGroup.selectAll<SVGLineElement, GraphLink>("line")
                    .attr("x1", d => (d.source as GraphNode).x!)
                    .attr("y1", d => (d.source as GraphNode).y!)
                    .attr("x2", d => (d.target as GraphNode).x!)
                    .attr("y2", d => (d.target as GraphNode).y!);
            });
        
        simulationRef.current = simulation;

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 8])
            .on("zoom", (event) => {
                containerRef.current?.attr("transform", event.transform.toString());
            });

        svg.call(zoom);
        zoomRef.current = zoom;
        hasInitializedZoom.current = false;

        return () => {
            simulation.stop();
        };
    }, []);

    // Update simulation and elements when data or dimensions change
    useEffect(() => {
        if (!simulationRef.current || !containerRef.current || dimensions.width === 0) return;

        const simulation = simulationRef.current;
        const { width, height } = dimensions;
        
        simulation.force('center', d3.forceCenter(width / 2, height / 2));
        simulation.nodes(graphData.nodes);
        
        const linkForce = d3.forceLink(graphData.links).id((d: any) => d.id).distance(50).strength(0.5);
        simulation.force('link', linkForce);

        const drag = d3.drag<SVGCircleElement, GraphNode>()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                d3.select(event.sourceEvent.target).style("cursor", "grabbing");
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                d3.select(event.sourceEvent.target).style("cursor", "grab");
            });
        
        const nodeSelection = containerRef.current.select<SVGGElement>(".nodes")
            .selectAll<SVGCircleElement, GraphNode>("circle")
            .data(graphData.nodes, d => d.id);

        nodeSelection.exit().remove();
        
        const enterSelection = nodeSelection.enter()
            .append("circle")
            .attr("r", 6)
            .attr("stroke", "#111827")
            .attr("stroke-width", 1.5)
            .call(drag);
        
        enterSelection.merge(nodeSelection)
            .attr("class", "node")
            .style("cursor", "grab");

        const linkSelection = containerRef.current.select<SVGGElement>(".links")
            .selectAll<SVGLineElement, GraphLink>("line")
            .data(graphData.links, d => `${(d.source as GraphNode).id}-${(d.target as GraphNode).id}`);

        linkSelection.exit().remove();
        linkSelection.enter().append("line")
            .merge(linkSelection)
            .attr("stroke-width", 1.5)
            .attr("stroke", "#4A5568")
            .attr("stroke-opacity", 0.6);


        simulation.alpha(1).restart();

        if (!hasInitializedZoom.current && width > 0 && graphData.nodes.length > 0 && zoomRef.current) {
            const svg = d3.select(svgRef.current!);
            
            // Heurística mejorada para el diámetro "natural" del grafo.
            // Se aumenta el factor para estimar un tamaño final más grande, resultando en un mayor zoom-out inicial.
            const graphRadius = 50 * Math.sqrt(graphData.nodes.length);
            const graphDiameter = graphRadius * 2;
            
            // Calcula la escala necesaria para ajustar este diámetro en la ventana, con un poco menos de relleno.
            const scaleToFit = Math.min(width / graphDiameter, height / graphDiameter) * 0.9;

            // Limita la escala, pero permite un zoom-out mayor si es necesario.
            const initialScale = Math.max(0.05, Math.min(1.2, scaleToFit));

            const centerX = width / 2;
            const centerY = height / 2;
            
            // Calcula la traslación para centrar el grafo después de escalar.
            const tx = centerX * (1 - initialScale);
            const ty = centerY * (1 - initialScale);

            const initialTransform = d3.zoomIdentity.translate(tx, ty).scale(initialScale);
            
            // Aplica la transformación calculada con una transición suave.
            svg.transition().duration(750).call(zoomRef.current.transform, initialTransform);
            
            hasInitializedZoom.current = true;
        }

    }, [graphData, dimensions]);

    return (
      <div ref={containerDivRef} className="w-full h-full cursor-grab active:cursor-grabbing relative">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="transition-opacity duration-500" style={{opacity: graphData.nodes.length > 0 ? 1 : 0}}>
        </svg>
      </div>
    );
};

export default GraphVisualizer;