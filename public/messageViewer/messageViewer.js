function messageViewer($log, $uibModal) {
  return {
    restrict: 'E',
    scope: {
      message: '=',
      baseUrl: '=',
      me: '=',
      messages: '=',
      reload: '&'
    },
    templateUrl: 'messageViewer/messageViewer.html',
    controller: ['$scope', function ($scope) {
      $scope.createTransaction = function(to) {
        openCreateTransactionDialog($uibModal, $scope.baseUrl, $scope.me, to, $scope.reload);
      }

      $scope.deleteMessage = function(message) {
        openDeleteMessageDialog($uibModal, $scope.baseUrl, message, $scope.messages);
      }

      $scope.createReply = function(message) {
        console.log('REPLY')
        openCreateReplyDialog($uibModal, $scope.baseUrl, $scope.me, message);
      }
    }]
  };
}