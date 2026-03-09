(function () {
  const connectBtn = document.getElementById("connectBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  const saveBtn = document.getElementById("saveBtn");
  const statusInput = document.getElementById("statusInput");
  const feedback = document.getElementById("feedback");
  const walletAddressEl = document.getElementById("walletAddress");
  const walletConnectionStatusEl = document.getElementById(
    "walletConnectionStatus",
  );
  const connectionPill = document.getElementById("connectionPill");
  const connectionText = document.getElementById("connectionText");
  const networkEl = document.getElementById("network");
  const contractAddressEl = document.getElementById("contractAddress");
  const onChainStatusEl = document.getElementById("onChainStatus");
  const updateCountEl = document.getElementById("updateCount");
  const lastUpdaterEl = document.getElementById("lastUpdater");
  const lastUpdatedAtEl = document.getElementById("lastUpdatedAt");
  const txBox = document.getElementById("txBox");
  const txHashEl = document.getElementById("txHash");
  const explorerLink = document.getElementById("explorerLink");

  const CONFIG = window.APP_CONFIG || {};
  const CONTRACT_ADDRESS = CONFIG.CONTRACT_ADDRESS || "";
  const CONTRACT_ABI = CONFIG.CONTRACT_ABI || [];

  const EXPLORERS = {
    1: { baseUrl: "https://etherscan.io", label: "Etherscan" },
    5: { baseUrl: "https://goerli.etherscan.io", label: "Goerli Etherscan" },
    56: { baseUrl: "https://bscscan.com", label: "BscScan" },
    97: { baseUrl: "https://testnet.bscscan.com", label: "BscScan Testnet" },
    137: { baseUrl: "https://polygonscan.com", label: "PolygonScan" },
    80002: {
      baseUrl: "https://amoy.polygonscan.com",
      label: "Polygon Amoy Scan",
    },
    11155111: {
      baseUrl: "https://sepolia.etherscan.io",
      label: "Sepolia Etherscan",
    },
  };

  let provider = null;
  let signer = null;
  let contract = null;
  let currentChainId = null;

  contractAddressEl.textContent =
    CONTRACT_ADDRESS || "0x794d96f24069C57C80Ad1ce35CC5205B12e2DfCE";

  function setFeedback(message, type) {
    feedback.className = "feedback " + (type || "info");
    feedback.innerHTML = message;
  }

  function formatDate(unix) {
    if (!unix || unix === 0n || unix === 0) return "-";
    const value = typeof unix === "bigint" ? Number(unix) : unix;
    return new Date(value * 1000).toLocaleString("pt-BR");
  }

  function getExplorerConfig(chainId) {
    return EXPLORERS[Number(chainId)] || null;
  }

  function isConfigured() {
    return /^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS);
  }

  function hasWallet() {
    return typeof window.ethereum !== "undefined";
  }

  function updateWalletConnectionUI(isConnected, address) {
    const shortAddress = address
      ? address.slice(0, 6) + "..." + address.slice(-4)
      : "";

    if (isConnected) {
      walletConnectionStatusEl.textContent = "Carteira conectada";
      connectionText.textContent = shortAddress
        ? "Carteira conectada (" + shortAddress + ")"
        : "Carteira conectada";
      connectionPill.classList.remove("disconnected");
      connectionPill.classList.add("connected");
      connectBtn.textContent = "Carteira conectada";
      walletAddressEl.textContent = address || "-";
      return;
    }

    walletConnectionStatusEl.textContent = "Carteira desconectada";
    connectionText.textContent = "Carteira desconectada";
    connectionPill.classList.remove("connected");
    connectionPill.classList.add("disconnected");
    connectBtn.textContent = "Conectar carteira";
    walletAddressEl.textContent = "-";
  }

  function renderTransactionLink(hash, chainId) {
    if (!hash) {
      txHashEl.textContent = "-";
      explorerLink.href = "#";
      explorerLink.textContent = "Nenhuma transação enviada ainda";
      return;
    }

    const explorer = getExplorerConfig(chainId);

    if (!explorer) {
      txHashEl.textContent = hash;
      explorerLink.href = "#";
      explorerLink.textContent = "Explorer não mapeado para esta rede";
      return;
    }

    const txUrl = explorer.baseUrl + "/tx/" + hash;
    const hashAnchor = document.createElement("a");
    hashAnchor.href = txUrl;
    hashAnchor.target = "_blank";
    hashAnchor.rel = "noopener noreferrer";
    hashAnchor.className = "tx-hash-link";
    hashAnchor.textContent = hash;

    txHashEl.innerHTML = "";
    txHashEl.appendChild(hashAnchor);

    explorerLink.href = txUrl;
    explorerLink.textContent =
      "Abrir detalhes da transação no " + explorer.label;
  }

  async function ensureProvider() {
    if (!hasWallet()) {
      throw new Error(
        "MetaMask não encontrada. Instale a extensão e recarregue a página.",
      );
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    currentChainId = Number(network.chainId);
    networkEl.textContent = network.name + " (" + currentChainId + ")";
    return provider;
  }

  async function ensureContract(readonlyMode) {
    await ensureProvider();

    if (!isConfigured()) {
      throw new Error(
        "Primeiro substitua o endereço do contrato em config.js.",
      );
    }

    if (readonlyMode) {
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      return contract;
    }

    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return contract;
  }

  async function connectWallet() {
    connectBtn.disabled = true;
    try {
      await ensureProvider();
      await window.ethereum.request({ method: "eth_requestAccounts" });
      signer = await provider.getSigner();
      const address = await signer.getAddress();
      updateWalletConnectionUI(true, address);
      setFeedback(
        "Carteira conectada com sucesso. Agora você já pode ler o contrato e enviar a transação.",
        "success",
      );
      await loadContractData();
    } catch (error) {
      updateWalletConnectionUI(false);
      setFeedback(
        error.message || "Não foi possível conectar a carteira.",
        "error",
      );
    } finally {
      connectBtn.disabled = false;
    }
  }

  async function loadContractData() {
    refreshBtn.disabled = true;
    try {
      const readContract = await ensureContract(true);
      const [status, updateCount, lastUpdater, lastUpdatedAt] =
        await Promise.all([
          readContract.getStatus(),
          readContract.updateCount(),
          readContract.lastUpdater(),
          readContract.lastUpdatedAt(),
        ]);

      onChainStatusEl.textContent = status || "-";
      updateCountEl.textContent = updateCount.toString();
      lastUpdaterEl.textContent = lastUpdater || "-";
      lastUpdatedAtEl.textContent = formatDate(lastUpdatedAt);

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts && accounts[0]) {
        updateWalletConnectionUI(true, accounts[0]);
      } else {
        updateWalletConnectionUI(false);
      }

      setFeedback("Leitura do contrato atualizada com sucesso.", "info");
    } catch (error) {
      setFeedback(error.message || "Erro ao ler o contrato.", "error");
    } finally {
      refreshBtn.disabled = false;
    }
  }

  async function sendStatus() {
    const newStatus = (statusInput.value || "").trim();
    if (!newStatus) {
      setFeedback("Digite um status antes de enviar.", "warn");
      statusInput.focus();
      return;
    }

    if (newStatus.length > 120) {
      setFeedback("O status deve ter no máximo 120 caracteres.", "warn");
      return;
    }

    saveBtn.disabled = true;
    txBox.hidden = true;

    try {
      const writeContract = await ensureContract(false);
      const address = await signer.getAddress();
      updateWalletConnectionUI(true, address);

      setFeedback(
        "MetaMask aberta. Confirme a transação para gravar o novo status na blockchain.",
        "warn",
      );
      const tx = await writeContract.setStatus(newStatus);

      renderTransactionLink(tx.hash, currentChainId);
      txBox.hidden = false;

      const explorer = getExplorerConfig(currentChainId);
      if (explorer && (currentChainId === 56 || currentChainId === 97)) {
        setFeedback(
          "Transação enviada. O hash já está com link direto para o " +
            explorer.label +
            ".",
          "info",
        );
      } else {
        setFeedback(
          "Transação enviada. O hash já está com link direto para o explorer da rede.",
          "info",
        );
      }

      await tx.wait();
      setFeedback(
        "Transação confirmada com sucesso. Você já pode abrir o link da hash e tirar o print no explorer.",
        "success",
      );
      await loadContractData();
      statusInput.value = "";
    } catch (error) {
      const message =
        error && error.shortMessage
          ? error.shortMessage
          : error.message || "Erro ao enviar transação.";
      setFeedback(message, "error");
    } finally {
      saveBtn.disabled = false;
    }
  }

  async function handleAccountsChanged(accounts) {
    if (!accounts || accounts.length === 0) {
      updateWalletConnectionUI(false);
      setFeedback("A carteira foi desconectada no navegador.", "warn");
      return;
    }

    updateWalletConnectionUI(true, accounts[0]);
    await loadContractData();
  }

  async function handleChainChanged() {
    await loadContractData();
  }

  async function initializeWalletState() {
    if (!hasWallet()) return;

    try {
      await ensureProvider();
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts && accounts[0]) {
        updateWalletConnectionUI(true, accounts[0]);
      } else {
        updateWalletConnectionUI(false);
      }
    } catch (_) {
      updateWalletConnectionUI(false);
    }
  }

  connectBtn.addEventListener("click", connectWallet);
  refreshBtn.addEventListener("click", loadContractData);
  saveBtn.addEventListener("click", sendStatus);

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
  }

  updateWalletConnectionUI(false);
  renderTransactionLink("", null);

  if (!hasWallet()) {
    setFeedback(
      "MetaMask não foi detectada neste navegador. Para testar o projeto, instale a extensão e recarregue a página.",
      "warn",
    );
  } else if (!isConfigured()) {
    initializeWalletState();
    setFeedback(
      "Projeto pronto. Só falta colar o endereço do contrato em <strong>config.js</strong> e conectar a MetaMask.",
      "info",
    );
  } else {
    initializeWalletState();
    loadContractData();
  }
})();
