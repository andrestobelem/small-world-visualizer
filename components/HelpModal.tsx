import React from 'react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-cyan-400">Guía de Uso</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Cerrar modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6 text-gray-300">
                    <section>
                        <h3 className="text-lg font-semibold text-cyan-500 mb-2">Controles Principales</h3>
                        <dl className="space-y-2 text-sm">
                            <dt className="font-bold">Número de Nodos (N):</dt>
                            <dd className="pl-4 border-l-2 border-slate-600">Define cuántos puntos (nodos) hay en la red.</dd>
                            <dt className="font-bold">Vecinos por Nodo (K):</dt>
                            <dd className="pl-4 border-l-2 border-slate-600">Determina a cuántos vecinos cercanos se conecta cada nodo inicialmente en la estructura de anillo. Debe ser un número par.</dd>
                            <dt className="font-bold">Probabilidad de Reconexión (p):</dt>
                            <dd className="pl-4 border-l-2 border-slate-600">Es la probabilidad de que una conexión sea alterada. Un valor de 0 crea una red regular y ordenada. Un valor de 1 crea una red completamente aleatoria. Los valores intermedios generan redes de "mundo pequeño".</dd>
                        </dl>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-cyan-500 mb-2">Interacción con el Grafo</h3>
                         <ul className="list-disc list-inside space-y-1 text-sm">
                            <li><span className="font-bold">Zoom:</span> Usa la rueda del ratón para acercar o alejar la vista.</li>
                            <li><span className="font-bold">Mover (Pan):</span> Haz clic y arrastra en cualquier espacio vacío del fondo para desplazar el grafo.</li>
                            <li><span className="font-bold">Arrastrar Nodos:</span> Haz clic y arrastra un nodo para reposicionarlo.</li>
                         </ul>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-semibold text-cyan-500 mb-2">Métricas</h3>
                        <dl className="space-y-2 text-sm">
                            <dt className="font-bold">Camino Medio:</dt>
                            <dd className="pl-4 border-l-2 border-slate-600">El número promedio de pasos en los caminos más cortos para todos los pares de nodos posibles en la red.</dd>
                            <dt className="font-bold">Agrupamiento:</dt>
                            <dd className="pl-4 border-l-2 border-slate-600">Una medida del grado en que los nodos de un grafo tienden a agruparse. Mide la proporción de "amigos de mis amigos que también son mis amigos".</dd>
                        </dl>
                    </section>
                </div>

                <div className="mt-8 text-right">
                    <button 
                        onClick={onClose} 
                        className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;