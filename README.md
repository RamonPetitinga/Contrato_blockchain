# Mini Projeto Web3 - Registro de Status na Blockchain

Projeto criado para a atividade **"Minha Primeira Integração com Blockchain"**.

## O que este projeto demonstra

Um site simples conversa com um contrato inteligente na blockchain.
A ação escolhida foi a mais direta para a tarefa:

**Registrar um dado na blockchain** usando a função `setStatus(string)`.

Exemplo de uso:
- `Produto enviado`
- `Pedido aprovado`
- `Certificado emitido`

## Estrutura do projeto

- `contracts/StatusRegistry.sol` -> contrato Solidity
- `frontend/index.html` -> interface web
- `frontend/style.css` -> estilo visual
- `frontend/app.js` -> integração com MetaMask + Ethers.js
- `frontend/config.js` -> endereço do contrato e ABI
- `docs/Relatorio_Modelo_1_Pagina.docx` -> modelo editável do relatório
- `docs/Relatorio_Modelo_1_Pagina.pdf` -> modelo em PDF
- `docs/Guia_Execucao_Rapida.md` -> passo a passo para deploy e prints

## Passo a passo rápido

### 1. Deploy do contrato no Remix
1. Abra o Remix.
2. Crie um arquivo chamado `StatusRegistry.sol`.
3. Cole o conteúdo de `contracts/StatusRegistry.sol`.
4. Compile com Solidity `0.8.20` ou compatível.
5. Na aba **Deploy & Run Transactions**, selecione **Injected Provider - MetaMask**.
6. Escolha uma testnet (recomendado: **Sepolia**).
7. Faça o deploy do contrato.
8. Copie o endereço do contrato gerado.

### 2. Configurar o front-end
1. Abra `frontend/config.js`.
2. Substitua `COLE_AQUI_O_ENDERECO_DO_CONTRATO` pelo endereço do deploy.
3. Salve o arquivo.

### 3. Rodar o site
Você pode abrir com **Live Server** no VS Code ou com um servidor local simples.

Exemplo com Python:
```bash
cd frontend
python -m http.server 5500
```
Depois abra no navegador:
`http://localhost:5500`

### 4. Executar a demonstração
1. Clique em **Conectar carteira**.
2. Digite um status, por exemplo: `Produto enviado`.
3. Clique em **Enviar para a blockchain**.
4. Confirme a transação na MetaMask.
5. Aguarde a confirmação.
6. Copie o hash da transação ou abra no explorer.

## Prints exigidos pela atividade

Tire estes 3 prints:
1. **Contrato no explorer** mostrando o deploy.
2. **Tela do site com a carteira conectada**.
3. **Transação com hash da tx**.

## Observações importantes

- O ambiente daqui não consegue fazer deploy real em testnet nem conectar à sua MetaMask.
- Por isso, o projeto foi entregue **pronto para uso**, mas os **prints reais** precisam ser feitos por você depois do deploy.
- O relatório de 1 página já foi deixado pronto em modelo editável para você só inserir os prints e exportar em PDF.
