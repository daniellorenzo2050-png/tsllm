/**
 * CORE INTERNO DA REDE DE ASSOCIAÇÃO HEURÍSTICA (TS-LLM ENGINE)
 * Roda de forma 100% nativa sem APIs externas.
 */
class AdaptiveNeuralNetwork {
    constructor() {
        this.memoryStore = {};
        this.synapticWeights = {};
        this.initStorage();
    }

    async initStorage() {
        // Configuração do localForage apontando para o IndexedDB nativo
        localforage.config({
            driver: localforage.INDEXEDDB,
            name: 'TS_LLM_Database',
            storeName: 'synaptic_weights'
        });
        await this.hydrateBrain();
    }

    async hydrateBrain() {
        try {
            const savedMemory = await localforage.getItem('network_memory');
            const savedWeights = await localforage.getItem('network_weights');
            
            if (savedMemory) this.memoryStore = savedMemory;
            if (savedWeights) this.synapticWeights = savedWeights;

            this.updateUIMemoryCounter();
        } catch (err) {
            console.error("[Neural Core] Falha na hidratação de sinapses via IndexedDB", err);
        }
    }

    async learnAssociation(inputKey, outputValue) {
        // Registra o conhecimento no dicionário sináptico
        this.memoryStore[inputKey.toLowerCase().trim()] = outputValue;
        this.synapticWeights[inputKey.toLowerCase().trim()] = (this.synapticWeights[inputKey.toLowerCase().trim()] || 0) + 1;

        // Persiste as alterações imediatamente no IndexedDB
        await localforage.setItem('network_memory', this.memoryStore);
        await localforage.setItem('network_weights', this.synapticWeights);
        
        this.updateUIMemoryCounter();
    }

    activate(rawText, tokens) {
        const normalized = rawText.toLowerCase().trim();

        // 1. Processador de Aprendizado Ativo (Comando Explicito de Ensino: "X significa Y")
        if (normalized.includes("significa") || normalized.includes("é igual a")) {
            const parts = rawText.split(/significa|é igual a/i);
            if (parts.length === 2) {
                const key = parts[0].trim();
                const val = parts[1].trim();
                this.learnAssociation(key, val);
                return {
                    answer: `Entendido. Registrei esse padrão no IndexedDB. Sempre que me perguntar sobre "${key}", lembrarei que significa: "${val}".`,
                    nodesSize: Object.keys(this.memoryStore).length,
                    type: "learning"
                };
            }
        }

        // 2. Mecanismo de Busca por Correspondência em Matriz Sináptica
        for (let key in this.memoryStore) {
            if (normalized.includes(key)) {
                // Incrementa peso devido ao uso contínuo da sinapse
                this.synapticWeights[key]++;
                localforage.setItem('network_weights', this.synapticWeights);
                
                return {
                    answer: `[Memória Recuperada]: ${this.memoryStore[key]}`,
                    nodesSize: Object.keys(this.memoryStore).length,
                    type: "association"
                };
            }
        }

        // 3. Mecanismo Matemático Algorítmico Real
        if (/^[0-9+\-*/().\s]+$/.test(normalized)) {
            try {
                const evaluation = new Function(`return ${normalized}`)();
                if (typeof evaluation === 'number' && !isNaN(evaluation)) {
                    return {
                        answer: `Processamento aritmético concluído. Resultado: **${evaluation}**`,
                        nodesSize: Object.keys(this.memoryStore).length,
                        type: "math"
                    };
                }
            } catch (e) { /* Fallback em caso de erro matemático */ }
        }

        // 4. Resposta Heurística de Resíduo de Rede
        return {
            answer: `Análise Léptica concluída. Tokens analisados: [${tokens.join(', ')}]. Esta informação ainda não possui pesos sinápticos mapeados no IndexedDB. Me ensine dizendo por exemplo: "${rawText} significa algo".`,
            nodesSize: Object.keys(this.memoryStore).length,
            type: "fallback"
        };
    }

    async clearBrain() {
        await localforage.clear();
        this.memoryStore = {};
        this.synapticWeights = {};
        this.updateUIMemoryCounter();
    }

    updateUIMemoryCounter() {
        const countEl = document.getElementById('memoryCount');
        if (countEl) {
            const size = Object.keys(this.memoryStore).length;
            countEl.innerText = `${size} nó(s) sinápticos gravados`;
        }
    }
}

// Expõe a instância única no escopo global antes dos orquestradores
window.NeuralNetworkCore = new AdaptiveNeuralNetwork();
