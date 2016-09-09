function MainController($scope, innergerbil, $q) {
  var partyContactDetails;
  var promises = [];
  //var baseUrl = 'https://inner-gerbil-test.herokuapp.com';
  var baseUrl = 'https://inner-gerbil-sorokh-test.herokuapp.com';
  // TODO: client of innergerbil service should not know root URL

  //innergerbil.getListResourcePaged("http://localhost:5000/parties", {
  promises.push(innergerbil.getResource(baseUrl + '/me', {}));
  //promises.push(innergerbil.getListResourcePaged(baseUrl + '/contactdetails', {
  //  forDescendantsOfParties: groupParty,
  //  public: true
  //}));

  $scope.baseUrl = baseUrl;
  return $q.all(promises).then(function (results) {
    $scope.me = results[0];
    //partyContactDetails = results[1].results;
    //addContactDetailsToParties($scope.members, partyContactDetails);
    //splitContactDetails($scope.members);
    console.info("me : ");
    console.info($scope.me); // eslint-disable-line
  });
};

angular
    .module('arty')
    .controller('MainController', MainController)
    .controller('MembersController', MembersController)
    .controller('ProfileController', ProfileController)
    .controller('TransactionsController', TransactionsController)
    .controller('EventsController', EventsController)
    .controller('DeleteMessageDialogController', DeleteMessageDialogController)
    .controller('CreateTransactionDialogController', CreateTransactionDialogController)
    .controller('CreateMessageDialogController', CreateMessageDialogController)
    .controller('CreateReplyDialogController', CreateReplyDialogController)

function addContactDetailsToParties(parties, contactdetails) {
  'use strict';
  var permalinkToParty = {};

  // Handle single items the same as an array. Convert to singleton array.
  if(parties && !parties.forEach) {
    parties = [parties];
  }

  parties.forEach(function (party) {
    permalinkToParty[party.$$meta.permalink] = party;
  });

  contactdetails.forEach(function (contactdetail) {
    contactdetail.$$parties.forEach(function (party) {
      if (!permalinkToParty[party.href].$$contactdetails) {
        permalinkToParty[party.href].$$contactdetails = [];
      }
      permalinkToParty[party.href].$$contactdetails.push(contactdetail);
    });
  });
}

function addPartiesToTransactions(transactions, parties) {
  'use strict';
  var permalinkToParty = {};

  parties.forEach(function (party) {
    permalinkToParty[party.$$meta.permalink] = party;
  });

  transactions.forEach(function (transaction) {
    transaction.from.$$expanded = permalinkToParty[transaction.from.href];
    transaction.to.$$expanded = permalinkToParty[transaction.to.href];
  });
}

function splitContactDetails(parties) {
  'use strict';

  // Handle single items the same as an array. Convert to singleton array.
  if(parties && !parties.forEach) {
    parties = [parties];
  }

  parties.forEach(function (party) {
    if (party.$$contactdetails) {
      party.$$contactdetails.forEach(function (detail) {
        if (detail.type === 'address') {
          if (!party.$$addresses) {
            party.$$addresses = [];
          }
          party.$$addresses.push(detail);
        } else if (detail.type === 'email') {
          if (!party.$$emails) {
            party.$$emails = [];
          }
          party.$$emails.push(detail);
        } else if (detail.type === 'phone') {
          if (!party.$$phones) {
            party.$$phones = [];
          }
          party.$$phones.push(detail);
        }
      });
    }
  });
}

/* Find the balances for the parties, and add them as $$balance to the corresponding party. */
function addBalancesOfPartyrelationsToParties(parties, partyrelations, currentgroup) {
  var i, permalink;
  var fromToPartyrelation = {};
  var partyrelation;

  // Handle single items the same as an array. Convert to singleton array.
  if(parties && !parties.forEach) {
    parties = [parties];
  }

  for(i=0; i<partyrelations.length; i++) {
    permalink = partyrelations[i].from.href;
    fromToPartyrelation[permalink] = partyrelations[i];
  }

  for(i=0; i<parties.length; i++) {
    permalink = parties[i].$$meta.permalink;
    partyrelation = fromToPartyrelation[permalink];
    if(partyrelation) {
      if(parties[i].$$balance) console.error('More than 1 balance in this context ???');
      parties[i].$$balance = fromToPartyrelation[permalink].balance;
    }
  }
}

/* Convert an array of SRI resource into an associative object, based on permalink */
function arrayToObjectOnPermalink(elements) {
  var ret = {};
  var i;

  for(i=0; i<elements.length; i++) {
    ret[elements[i].$$meta.permalink] = elements[i];
  }

  return ret;
}

/* Converts an array of SRI link ([{ href: ... },...]) into an array of permalinks. */
function arrayOfPermalinksFromArrayOfSRILinks(sriLinks) {
  var ret = [];
  var i;

  if(sriLinks && sriLinks.length > 0) {
    for(i=0; i<sriLinks.length; i++) {
      ret.push(sriLinks[i].href);
    }
  }

  return ret;
}

/* Add replies to message. */
function addReactionsToMessages(messages, reactions) {
  var i, message, reaction;
  var permalinkToReaction = arrayToObjectOnPermalink(reactions);

  for(i=0; i<messages.length; i++) {
    message = messages[i];
    if(message.$$reactions && message.$$reactions.length > 0) {
      for(j=0; j<message.$$reactions.length; j++) {
        reaction = message.$$reactions[j];
        reaction.$$expanded = permalinkToReaction[reaction.href];
      }
    }
  }
}