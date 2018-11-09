var PokemonDraft = artifacts.require("./PokemonDraft.sol");

module.exports = function(deployer) {
  deployer.deploy(PokemonDraft);
};
