window.APP_CONFIG = {
  CONTRACT_ADDRESS: "0x794d96f24069C57C80Ad1ce35CC5205B12e2DfCE",
  CONTRACT_ABI: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "updater",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "newStatus",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "updatedAt",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "updateCount",
          type: "uint256",
        },
      ],
      name: "StatusUpdated",
      type: "event",
    },
    {
      inputs: [],
      name: "getStatus",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastUpdatedAt",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastUpdater",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "newStatus", type: "string" }],
      name: "setStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "updateCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ],
};
