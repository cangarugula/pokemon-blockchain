pragma solidity ^0.4.24;

contract PokemonAdoption {
    // an array of addresses(accounts) with length of 16
    address[16] public trainers;

    // takes an pokemon id (an integer) and returns an integer(pokemone id) after the purchases is registered as the pokemon's trainer
    function purchase(uint pokeId) public returns (uint) {
        require(pokeId >= 0 && pokeId <= trainers.length);

        trainers[pokeId] = msg.sender;
        return pokeId;
    }

    function getAdopters() public view returns (address[16]) {
        return trainers;
    }


}
