
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pokemon
    $.getJSON('../pokemon.json', function(data) {
      var pokemonRow = $('#pokemonRow');
      var pokemonTemplate = $('#pokemonTemplate');

      for (i = 0; i < data.length; i ++) {
        pokemonTemplate.find('.panel-title').text(data[i].name);
        pokemonTemplate.find('img').attr('src', data[i].picture);
        pokemonTemplate.find('.pokemon-type').text(data[i].type);
        pokemonTemplate.find('.pokemon-hp').text(data[i].hp);
        pokemonTemplate.find('.pokemon-attack').text(data[i].attack);
        pokemonTemplate.find('.pokemon-defense').text(data[i].defense);
        pokemonTemplate.find('.pokemon-speed').text(data[i].speed);
        pokemonTemplate.find('.pokemon-advantage').text(data[i].advantage);
        pokemonTemplate.find('.pokemon-weaknesses').text(data[i].weaknesses);
        pokemonTemplate.find('.btn-draft').attr('data-id', data[i].id);
        pokemonTemplate.find('.details').attr('data-id', data[i].id);
        pokemonTemplate.find('.details').hide()
        pokemonRow.append(pokemonTemplate.html());
      }
    });
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // we get an instance of web3 on our window from metamask
    if (typeof web3 !== 'undefined') {
        // if a web 3 instance is already provided by Meta MAsk.
        // when we log into meta mask it provides us with a web 3 provider
        App.web3Provider = web3.currentProvider;
        // we set the one it gives us to our application's web 3 provider
        web3 = new Web3(web3.currentProvider);
    } else {
        // if it doesn't give us one, we will set a default one to our application's web 3 provider
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('PokemonAdoption.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var PokemonAdoptionArtifact = data;
        App.contracts.PokemonAdoption = TruffleContract(PokemonAdoptionArtifact);

        // Set the provider for our contract
        App.contracts.PokemonAdoption.setProvider(App.web3Provider);

        // Use our contract to retrieve and mark the adopted pokemon
        return App.markAdopted();
      });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-draft', App.handleAdopt)

  },

  markAdopted: function(adopters, account) {
    let adoptionInstance;

    App.contracts.PokemonAdoption.deployed()
    .then(function(instance){
        adoptionInstance = instance
        console.log('marked adpoted deployed')
        return adoptionInstance.getAdopters.call()
    })
    .then(function(adopters){
        for(i = 0; i < adopters.length; i++) {
            if(adopters[i] !== "0x0000000000000000000000000000000000000000") {
                console.log('marked adopted finding the button')
                $('.panel-pokemon').eq(i).find('button').text('Success').attr('disabled', true)
            }
        }
    })
    .catch(function(err) {
        console.log(err.message)
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    let petId = parseInt($(event.target).data('id'));

    let adoptionInstance;

    web3.eth.getAccounts(function(err, accounts) {
        if(err) {
            console.log(err)
        }

        let account = accounts[0]

        App.contracts.PokemonAdoption.deployed()
        .then(function(instance) {
            adoptionInstance = instance
            // executes the adopt function and passes it some meta data for us to store on adopters array as msg.sender
            console.log('handleadopt deployed')
            return adoptionInstance.adopt(petId, { from: account })
        })
        .then(function(result) {
            console.log('handleadopt mark adopted')
            return App.markAdopted()
        })
        .catch(function(err) {
            console.log('hello')
            console.log(err.message)
        })
    })

  },

  handleDetails: function(event) {
      event.preventDefault()
      var pokemonTemplate = $('#pokemonTemplate');
      pokemonTemplate.find('.details').show()
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
