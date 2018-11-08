App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });
    $(".banner").css({"height": (($(window).height()))+"px"});

    $(window).on("resize", function(){
    $(".banner").css({"height": (($(window).height()))+"px"});
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
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    let adoptionInstance;

    App.contracts.PokemonAdoption.deployed()
    .then(function(instance){
        adoptionInstance = instance
        return adoptionInstance.getAdopters.call()
    })
    .then(function(adopters){
        for(let i = 0; i < adopters.length; i++) {
            if(adopters[i] !== "0x0000000000000000000000000000000000000000") {
                $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true)
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
    console.log('pet id ', petId)
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
            return adoptionInstance.adopt(petId, { from: account })
        })
        .then(function(result) {
            return App.markAdopted()
        })
        .catch(function(err) {
            console.log(err.message)
        })
    })

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
