# Guia de Execução Rápida

## Caso escolhido

**Registrar um dado na blockchain**.

## Função usada

`setStatus(string newStatus)`

## Exemplo recomendado para apresentação

Digite no site:
`Produto enviado`

## Roteiro exato para entregar

### A. Deploy

- Abrir Remix
- Colar o contrato `StatusRegistry.sol`
- Compilar
- Conectar MetaMask
- Fazer deploy em testnet

### B. Configurar o site

- Abrir `frontend/config.js`
- Colar o endereço do contrato
- Rodar `frontend/index.html` por servidor local

### C. Fazer a demonstração

- Conectar carteira no site
- Inserir o texto `Produto enviado`
- Confirmar a transação
- Esperar a confirmação
