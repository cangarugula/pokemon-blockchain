pragma solidity ^0.4.21;

contract PokemonAdoption {
    // an array of addresses(accounts) with length of 16
    address[16] public adopters; // adopters

    // takes an pokemon id (an integer) and returns an integer(pokemone id) after the adoption is registered as the pokemon's trainer
    function adopt(uint pokeId) public returns (uint) {
        // making sure that the pokemon's id can be found within the adopters array
        require(pokeId >= 0 && pokeId <= 15);

        adopters[pokeId] = msg.sender;
        return pokeId;
    }

    function getAdopters() public view returns (address[16]) {
        return adopters;
    }


}
