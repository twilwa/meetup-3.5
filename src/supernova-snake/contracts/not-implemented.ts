export class NotImplementedContractError extends Error {
  contractName: string;

  constructor(contractName: string) {
    super(`Contract not implemented: ${contractName}`);
    this.name = "NotImplementedContractError";
    this.contractName = contractName;
  }
}

export function contractStub<TArgs extends unknown[], TResult>(
  contractName: string,
): (...args: TArgs) => TResult {
  return function unimplementedContract(): TResult {
    throw new NotImplementedContractError(contractName);
  };
}
