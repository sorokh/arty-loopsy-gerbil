function ProfileController($scope, innergerbil, $q, $stateParams, $uibModal) {
  'use strict';
  var promises = [];
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849';

  $scope.key = $stateParams.key;

  $scope.reload = function() {
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
    promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/messages', {
      postedByParties: '/parties/' + $scope.key,
      expand: 'results.author'
    }));

    return $q.all(promises).then(function (results) {
      var reactions = [];
      var i;
      $scope.profile = results[0];
      $scope.contactdetails = results[1].results;
      $scope.partyrelations = results[2].results;
      $scope.transactions = results[3].results;
      $scope.messages = results[4].results;
      addContactDetailsToParties($scope.profile,$scope.contactdetails);
      splitContactDetails($scope.profile);
      addBalancesOfPartyrelationsToParties($scope.profile, $scope.partyrelations, groupParty)
console.info('$scope.messages');
console.info($scope.messages);
      for (i = 0; i < $scope.messages.length; i++) {
        reactions = reactions.concat(arrayOfPermalinksFromArrayOfSRILinks($scope.messages[i].$$reactions));
      }
      return innergerbil.getPatternBatch($scope.baseUrl + '/messages?expand=results.author&hrefs=*', reactions);
    }).then(function (reactions) {
      addReactionsToMessages($scope.messages, reactions);
    });
  }

  $scope.createTransaction = function(to) {
    openCreateTransactionDialog($uibModal, $scope.baseUrl, $scope.me.$$meta.permalink, to);
  }

  return $scope.reload();
}
