var PokemonAdoption = artifacts.require("./PokemonAdoption.sol");

module.exports = function(deployer) {
  deployer.deploy(PokemonAdoption);
};
