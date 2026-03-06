const { contractStub } = require("./not-implemented");

module.exports = {
  createRunState: contractStub("core-loop.createRunState"),
  queueTurn: contractStub("core-loop.queueTurn"),
  advanceTick: contractStub("core-loop.advanceTick"),
  resolveCollision: contractStub("core-loop.resolveCollision"),
  buildRunResults: contractStub("core-loop.buildRunResults"),
};
