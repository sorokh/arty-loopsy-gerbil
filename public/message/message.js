function messageDirective($log, $uibModal) {
  return {
    restrict: 'E',
    scope: {
      message: '=',
      baseUrl: '=',
      me: '=',
      messages: '='
    },
    templateUrl: 'message/message.html',
    controller: ['$scope', function ($scope) {
      $scope.delete = function (currentMessage) {
        $scope.currentMessage = currentMessage;
        console.info("current message : " + currentMessage);

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'message/deleteModal.html',
          controller: 'MessageDeleteModalController',
          size: 200,
          resolve: {
            message: function () {
              return $scope.currentMessage;
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