pragma solidity ^0.4.21;

contract PokemonDraft {
    // an array of addresses(accounts) with length of 15
    address[15] public trainers; // trainers

    // takes an pokemon id (an integer) and returns an integer(pokemone id) after the draft is registered and the pokemon belongs to the pokemon's trainer
    function draft(uint pokeId) public returns (uint) {
        // making sure that the pokemon's id can be found within the trainers array
        require(pokeId >= 0 && pokeId <= 14);

        trainers[pokeId] = msg.sender;
        return pokeId;
    }

    function getTrainers() public view returns (address[15]) {
        return trainers;
    }


}
