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

      $scope.deleteMessage = function(message) {
        openDeleteMessageDialog($uibModal, $scope.baseUrl, message, $scope.messages);
      }

      $scope.createReply = function(message) {
        openCreateReplyDialog($uibModal, $scope.baseUrl, $scope.me, message);
      }
    }]
  };
}