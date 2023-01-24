module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "5777",
    },
  },
  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/abis",
  compilers: {
    solc: {
      version: "0.8.7",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  db: {
    enabled: false,
  },
};
