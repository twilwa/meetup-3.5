const { contractStub } = require("./not-implemented");

module.exports = {
  earnMutationCharge: contractStub("mutations.earnMutationCharge"),
  activateMutation: contractStub("mutations.activateMutation"),
  tickMutationTimers: contractStub("mutations.tickMutationTimers"),
  resolveMutationPriority: contractStub("mutations.resolveMutationPriority"),
};
