function TransactionsController($scope, innergerbil, $q) {
  var promises = [];
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849';
  var baseUrl = 'https://inner-gerbil-test.herokuapp.com';
  // TODO: client of innergerbil service should not know root URL
  // TODO: use "me" as party in call to forDescendantsOfParties
  // TODO: also get transactions toDescendantsOfParties and join the 2 lists

  //innergerbil.getListResourcePaged("http://localhost:5000/parties", {
  //promises.push(innergerbil.getListResourcePaged('https://inner-gerbil-test.herokuapp.com/transactions', {
  //  descendantsOfParties: groupParty,
  //  type: 'person'
  //}));
  promises.push(innergerbil.getListResourcePaged('https://inner-gerbil-test.herokuapp.com/transactions', {
    fromDescendantsOfParties: groupParty
  }));

  $q.all(promises).then(function (results) {
    $scope.transactions = results[0].results;
    console.log($scope.transactions); // eslint-disable-line
  });
}
