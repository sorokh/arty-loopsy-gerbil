function messageDirective($log, $uibModal) {
  return {
    restrict: 'E',
    scope: {
      event: '=message',
      baseUrl: '=',
      me: '=',
      messages: '='
    },
    templateUrl: 'message/message.html',
    controller: ['$scope', function ($scope) {
      $scope.delete = function (message) {
        $scope.message = message;
        console.info("current message : " + message);

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'message/deleteModal.html',
          controller: 'MessageDeleteModalController',
          size: 200,
          resolve: {
            message: function () {
              return $scope.message;
            },
            baseUrl: function () {
              return $scope.baseUrl;
            },
            messages: function () {
              return $scope.messages;
            }
          }
        });
      };
    }]
  };
}