class ScriptTS extends HTMLElement {
    connectedCallback() {
        // Garante que a execução ocorre logo após o carregamento completo da janela e do Babel
        window.addEventListener('DOMContentLoaded', () => {
            this.compileAndInject();
        });
    }

    compileAndInject() {
        const tsCode = this.textContent;

        if (tsCode && window.Babel) {
            try {
                // Transpilação em Runtime injetando o contexto virtual de arquivo .ts
                const jsCode = window.Babel.transform(tsCode, {
                    filename: 'virtual-pipeline.ts',
                    presets: ['typescript']
                }).code;

                const scriptNode = document.createElement('script');
                scriptNode.textContent = jsCode;
                document.body.appendChild(scriptNode);
            } catch (err) {
                console.error("[Script-TS Compiler Layer Error]:", err.message);
            }
        }
    }
}

// Define o elemento customizado nativo no ecossistema DOM
customElements.define('script-ts', ScriptTS);
