function MainController() {
};

angular
    .module('inspinia')
    .controller('MainController', MainController)
    .controller('MembersController', MembersController)

function MembersController($scope) {
    // TODO: We should call server here to get the list of members of my lets group
    $scope.members = [
    {
      name: 'Steve Buytinck',
      imageurl: 'img/a2.jpg'
  },
    {
      name: 'Alex De Smedt',
      imageurl: 'img/a1.jpg'
  },
    {
      name: 'Nathalie Gols',
      imageurl: 'img/a5.jpg'
    }
  ];

};
