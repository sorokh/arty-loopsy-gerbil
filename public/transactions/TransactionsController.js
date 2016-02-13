function TransactionsController($scope, innergerbil, $q) {
  var parties;
  var promises = [];
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849';
  var baseUrl = 'https://inner-gerbil-test.herokuapp.com';
  // TODO: client of innergerbil service should not know root URL
  // TODO: use "me" as party in call to forDescendantsOfParties
  // TODO: also get transactions toDescendantsOfParties and join the 2 lists
  // TODO: still need to figure out how we are going to get the names of parties for interlets transactions

  //innergerbil.getListResourcePaged("http://localhost:5000/parties", {
  //promises.push(innergerbil.getListResourcePaged('https://inner-gerbil-test.herokuapp.com/transactions', {
  //  descendantsOfParties: groupParty,
  //  type: 'person'
  //}));
  promises.push(innergerbil.getListResourcePaged('https://inner-gerbil-test.herokuapp.com/transactions', {
    fromDescendantsOfParties: groupParty
  }));
  promises.push(innergerbil.getListResourcePaged('https://inner-gerbil-test.herokuapp.com/parties', {
    descendantsOfParties: groupParty,
    type: 'person'
  }));

  $q.all(promises).then(function (results) {
    $scope.transactions = results[0].results;
    parties = results[1].results;
    addPartiesToTransactions($scope.transactions, parties);
    console.log($scope.transactions); // eslint-disable-line
  });
}
