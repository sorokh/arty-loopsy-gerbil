function transactionList($log, $uibModal) {
  return {
    restrict: 'E',
    scope: {
      transactions: '='
    },
    templateUrl: 'transactionList/transactionList.html',
    controller: ['$scope', function ($scope) {
    }]
  };
}