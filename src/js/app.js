
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
    $.getJSON('PokemonDraft.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var PokemonDraftArtifact = data;
        App.contracts.PokemonDraft = TruffleContract(PokemonDraftArtifact);

        // Set the provider for our contract
        App.contracts.PokemonDraft.setProvider(App.web3Provider);

        // Use our contract to retrieve and mark the drafted pokemon
        return App.markDrafted();
      });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-draft', App.handleDraft)
  },

  markDrafted: function() {
    let draftInstance;

    App.contracts.PokemonDraft.deployed()
    .then(function(instance){
        draftInstance = instance
        return draftInstance.getTrainers.call()
    })
    .then(function(trainers){
        let draftRow = $('#draftRow');
        let draftTemplate = $('#draftTemplate');
        for(i = 0; i < trainers.length; i++) {
            if(trainers[i] !== "0x0000000000000000000000000000000000000000") {
                // $.getJSON('../pokemon.json', function(data) {
                // let pokemon = data[$('.panel-pokemon').find('button').attr('data-id')]
                // console.log(pokemon)
                $('.panel-pokemon').eq(i).find('button').text('Drafted').attr('disabled', true)
                // draftTemplate.find('.accountId').text(trainers[i]);
                // draftTemplate.find('.pokemon-name').text(pokemon.name)
                // draftRow.append(draftTemplate.html());
                // })
            }
        }
    })

    .catch(function(err) {
        console.log(err.message)
    })
  },

  handleDraft: function(event) {
    event.preventDefault();

    let pokeId = parseInt($(event.target).data('id'));

    let draftInstance;

    web3.eth.getAccounts(function(err, accounts) {
        if(err) {
            console.log(err)
        }

        let account = accounts[0]

        App.contracts.PokemonDraft.deployed()
        .then(function(instance) {
            draftInstance = instance
            // executes the draft function and passes it some meta data for us to store on trainers array as msg.sender
            console.log('handleDraft deployed')
            return draftInstance.draft(pokeId, { from: account })
        })
        .then(function(result) {
            console.log('handleDraft mark drafted')
            return App.markDrafted()
        })
        .catch(function(err) {
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
