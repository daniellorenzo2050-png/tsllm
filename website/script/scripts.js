document.getElementById('sendBtn').addEventListener('click', triggerPipelineExecution);
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') triggerPipelineExecution();
});
document.getElementById('clearMemoryBtn').addEventListener('click', clearNeuralDatabase);

function triggerPipelineExecution() {
    const inputElement = document.getElementById('userInput');
    const text = inputElement.value.trim();

    if (!text) return;

    // 1. Injeta a caixa de diálogo do Usuário
    appendChatBubble(text, 'user-msg', '👤');
    inputElement.value = '';

    // 2. Executa indicador de processamento sináptico
    const feedbackId = appendProcessingIndicator();

    setTimeout(() => {
        removeProcessingIndicator(feedbackId);

        // 3. Aciona o Gateway TypeScript Gerenciado
        if (window.TS_GATEWAY && typeof window.TS_GATEWAY.processAndRoute === 'function') {
            const evaluation = window.TS_GATEWAY.processAndRoute(text);
            
            // Converte marcadores em negrito para tags HTML
            const sanitizedHtml = evaluation.output.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            appendChatBubble(sanitizedHtml, 'ai-msg', '🧠');
        } else {
            appendChatBubble("Erro crítico de sincronismo: O Gateway TS não respondeu a tempo.", 'system-msg', '⚠️');
        }
    }, 450);
}

function appendChatBubble(content, styleClass, icon) {
    const chatBox = document.getElementById('chatBox');
    const msgContainer = document.createElement('div');
    msgContainer.className = `message ${styleClass}`;

    msgContainer.innerHTML = `
        <div class="avatar">${icon}</div>
        <div class="bubble">${content}</div>
    `;

    chatBox.appendChild(msgContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendProcessingIndicator() {
    const chatBox = document.getElementById('chatBox');
    const id = 'neural-proc-' + Date.now();
    
    const procContainer = document.createElement('div');
    procContainer.className = 'message ai-msg';
    procContainer.id = id;
    procContainer.innerHTML = `
        <div class="avatar">🧠</div>
        <div class="bubble" style="color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size:0.85rem;">
            Calculando sinapses locais...
        </div>
    `;
    
    chatBox.appendChild(procContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function removeProcessingIndicator(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
}

function clearNeuralDatabase() {
    if (window.NeuralNetworkCore && confirm("Deseja realmente apagar o IndexedDB da IA?")) {
        window.NeuralNetworkCore.clearBrain().then(() => {
            appendChatBubble("Banco de dados IndexedDB resetado. Memória limpa com sucesso.", "system-msg", "⚙️");
        });
    }
}
