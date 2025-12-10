/*
 * Lógica da Aplicação de Precificação com Markup
 */

function calcularPreco() {
    // 1. Coletar os valores de entrada, tratando inputs vazios como 0
    const custo = parseFloat(document.getElementById('custo-unitario').value) || 0;
    const impostos = parseFloat(document.getElementById('percentual-impostos').value) || 0;
    const despesas = parseFloat(document.getElementById('percentual-despesas').value) || 0;
    const lucro = parseFloat(document.getElementById('margem-lucro-desejada').value) || 0;

    // 2. Conversão e Soma dos Fatores Percentuais
    const impostosDecimal = impostos / 100;
    const despesasDecimal = despesas / 100;
    const lucroDecimal = lucro / 100;

    const somaFatoresDecimal = impostosDecimal + despesasDecimal + lucroDecimal;
    const somaFatoresPercentual = somaFatoresDecimal * 100;

    let precoVenda = 0;
    let fatorMarkup = 0;
    
    // Atualiza a exibição da Soma dos Fatores
    document.getElementById('soma-fatores-display').textContent = `${somaFatoresPercentual.toFixed(2)}%`;

    // 3. Validação: A soma dos fatores deve ser menor que 100%
    if (somaFatoresDecimal >= 1) {
        document.getElementById('resultado').textContent = 'Fatores excedem 100%! Ajuste os percentuais.';
        document.getElementById('fator-markup-display').textContent = 'ERRO';
        return;
    }

    // 4. Cálculo do Fator de Markup: Fator = 1 / (1 - Soma dos Fatores Decimais)
    fatorMarkup = 1 / (1 - somaFatoresDecimal);
    
    // Atualiza a exibição do Fator de Markup
    document.getElementById('fator-markup-display').textContent = fatorMarkup.toFixed(4);

    // 5. Cálculo do Preço de Venda
    precoVenda = custo * fatorMarkup;

    // 6. Formatação e Exibição do Resultado Final
    const resultadoFormatado = precoVenda.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    document.getElementById('resultado').textContent = resultadoFormatado;
}


/*
 * Lógica da Navegação por Abas
 */
function showTab(tabId) {
    // Esconde todos os conteúdos de abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove a classe 'active' de todos os botões
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Mostra o conteúdo da aba selecionada
    document.getElementById(tabId).classList.add('active');

    // Ativa o botão selecionado
    const selectedButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Recalcula o preço para atualizar o Markup Display se a aba for trocada
    calcularPreco(); 
}


/*
 * Ponto de Inicialização Universal (Cordova & Web)
 */

function initializeApp() {
    
    // 1. Liga a função de cálculo ao clique do botão
    const btn = document.getElementById('calcular-btn');
    // Melhor prática: remove o listener antes de adicionar para evitar duplicatas em hot-reload
    btn.removeEventListener('click', calcularPreco); 
    btn.addEventListener('click', calcularPreco); 

    // 2. Executa o cálculo inicial (para popular os displays com os valores padrão)
    calcularPreco();
    
    // 3. Mostra a primeira aba (tab-precificacao) ao carregar
    showTab('tab-precificacao');
}

// Verifica se está no ambiente Cordova ou Web
// Para Cordova: Espera pelo evento 'deviceready'
if (window.cordova) {
    document.addEventListener('deviceready', initializeApp, false);
} 
// Para Web: Espera pelo evento 'DOMContentLoaded'
else {
    document.addEventListener('DOMContentLoaded', initializeApp);
}