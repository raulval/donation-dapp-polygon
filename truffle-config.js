const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
// const mnemonic = fs.readFileSync(".secret").toString().trim();
const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
    },
    matic: {
      provider: () =>
        new HDWalletProvider({
          // As per the documentation at https://github.com/trufflesuite/truffle/tree/develop/packages/hdwallet-provider#general-usage
          // "If both mnemonic and private keys are provided, the mnemonic is used."
          // Therefore, uncomment the following lines to use a mnemonic instead of a private key:
          // mnemonic: {
          //   phrase: mnemonic,
          // },
          privateKeys: [privateKey],
          providerOrUrl: `https://rpc-mumbai.maticvigil.com/`,
          chainId: 80001,
        }),
      network_id: 80001,
      networkCheckTimeout: 10000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001,
    },
  },
  migrations_directory: "./src/migrations",
  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/abis",
  compilers: {
    solc: {
      version: "^0.8.6",
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
