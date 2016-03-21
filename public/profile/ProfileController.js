function ProfileController($scope, innergerbil, $q, $stateParams) {
  'use strict';
  var promises = [];
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849';

  $scope.key = $stateParams.key;

  promises.push(innergerbil.getResource($scope.baseUrl + '/parties/' + $scope.key, {}));
  promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/contactdetails', {
    forParties: '/parties/' + $scope.key
  }));
  promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/partyrelations', {
    from: '/parties/' + $scope.key
  }));
  promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/transactions', {
    involvingParties: '/parties/' + $scope.key,
    expand: 'results.from,results.to'
  }));


  return $q.all(promises).then(function (results) {
    $scope.profile = results[0];
    $scope.contactdetails = results[1].results;
    $scope.partyrelations = results[2].results;
    $scope.transactions = results[3].results;
    addContactDetailsToParties($scope.profile,$scope.contactdetails);
    splitContactDetails($scope.profile);
    addBalancesOfPartyrelationsToParties($scope.profile, $scope.partyrelations, groupParty)
//    console.log('$scope.profile ->');
//    console.log($scope.profile); // eslint-disable-line
console.info('$scope.transactions');
console.info($scope.transactions);
  });
}
