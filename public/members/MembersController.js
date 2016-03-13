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
    addBalancesOfPartyrelationsToParties($scope.members, partyrelations, groupParty);
    splitContactDetails($scope.members);
    console.log('$scope.members ->');
    console.log($scope.members); // eslint-disable-line
  });
}
