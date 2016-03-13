/* Find the balances for the parties, and add them as $$balance to the corresponding party. */
function addBalancesToParties(parties, partyrelations, currentgroup) {
  var i, permalink;
  var fromToPartyrelation = {};
  var partyrelation;

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

function MembersController($scope, innergerbil, $q) {
  var partyContactDetails;
  var partyrelations;
  var promises = [];
  // TODO: use "me" as party in call to forDescendantsOfParties
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849';

  promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/parties', {
    descendantsOfParties: groupParty,
    type: 'person'
  }));
  promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/contactdetails', {
    forDescendantsOfParties: groupParty,
    public: true
  }));
  promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/partyrelations', {
    forDescendantsOfParties: groupParty
  }));

  return $q.all(promises).then(function (results) {
    $scope.members = results[0].results;
    partyContactDetails = results[1].results;
    partyrelations = results[2].results;
    addContactDetailsToParties($scope.members, partyContactDetails);
    addBalancesToParties($scope.members, partyrelations, groupParty);
    splitContactDetails($scope.members);
    console.log('$scope.members ->');
    console.log($scope.members); // eslint-disable-line
  });
}
