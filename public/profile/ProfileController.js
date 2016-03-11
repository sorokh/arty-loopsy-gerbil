function ProfileController($scope, innergerbil, $q) {
  var partyContactDetails;
  var promises = [];
  var baseUrl = 'https://inner-gerbil-test.herokuapp.com';
  // TODO: client of innergerbil service should not know root URL

  //innergerbil.getListResourcePaged("http://localhost:5000/parties", {
  promises.push(innergerbil.getResource('https://inner-gerbil-test.herokuapp.com/me', {}));
  //promises.push(innergerbil.getListResourcePaged('https://inner-gerbil-test.herokuapp.com/contactdetails', {
  //  forDescendantsOfParties: groupParty,
  //  public: true
  //}));

  $q.all(promises).then(function (results) {
    $scope.me = results[0];
    $scope.baseUrl = baseUrl;
    //partyContactDetails = results[1].results;
    //addContactDetailsToParties($scope.members, partyContactDetails);
    //splitContactDetails($scope.members);
    console.log($scope.me); // eslint-disable-line
  });
}
