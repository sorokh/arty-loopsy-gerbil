function messageViewer($log, $uibModal) {
  return {
    restrict: 'E',
    scope: {
      message: '=',
      baseUrl: '=',
      me: '=',
      messages: '='
    },
    templateUrl: 'messageViewer/messageViewer.html',
    controller: ['$scope', function ($scope) {
      $scope.createTransaction = function(to) {
        openCreateTransactionDialog($uibModal, $scope.baseUrl, $scope.me.$$meta.permalink, to);
      }

      $scope.delete = function (currentMessage) {
        $scope.currentMessage = currentMessage;
        console.info("current message : " + currentMessage);

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'messageViewer/deleteMessageDialog.html',
          controller: 'DeleteMessageDialogController',
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