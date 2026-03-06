class NotImplementedContractError extends Error {
  constructor(contractName) {
    super(`Contract not implemented: ${contractName}`);
    this.name = "NotImplementedContractError";
    this.contractName = contractName;
  }
}

function contractStub(contractName) {
  return function unimplementedContract() {
    throw new NotImplementedContractError(contractName);
  };
}

module.exports = {
  NotImplementedContractError,
  contractStub,
};
