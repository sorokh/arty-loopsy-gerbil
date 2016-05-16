function CreateTransactionDialogController ($scope, $uibModalInstance, innergerbil, toaster, baseUrl, from, to, refresh) {
  'use strict';
  $scope.from = from;
  $scope.to = to;
  $scope.baseUrl = baseUrl;
  $scope.amount = 0;
  $scope.refresh = refresh;

  $scope.ok = function () {
    console.info('amount : ' + $scope.amount)
    var transaction;
    var transactionGuid = innergerbil.generateGUID();
    var transactionUrl = '/transactions/' + transactionGuid;
    transaction = {
      $$meta: {
        permalink: transactionUrl
      },
      key: transactionGuid,
      from: {
        href: $scope.from
      },
      to: {
        href: $scope.to
      },
      amount: $scope.amount
    };

    console.info('Sending batch : ');
    console.info(transaction);
    return innergerbil.createOrUpdateResource($scope.baseUrl, transaction).then(function (result){
      $uibModalInstance.close();
// TODO : When expansion on sri4node is fixed, switch to 'from' and 'to' as objects, rather than permalinks + restore the full message.
//      $scope.pop('success','Transactie aangemaakt.','Je hebt ' + transaction.amount + ' punt(en) gewaardeerd aan ' + transaction.to.$$expanded.name);
      if($scope.refresh) $scope.refresh();
      toaster.pop('success','Transactie aangemaakt.','Je hebt ' + transaction.amount + ' punt(en) gewaardeerd.');
    }).catch(function (response) {
      console.error('unable to create transaction ' + response.error);
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

function openCreateTransactionDialog ($uibModal, baseUrl, from, to, refresh) {
  var modalInstance = $uibModal.open({
    animation: true,
    templateUrl: 'createTransactionDialog/createTransactionDialog.html',
    controller: 'CreateTransactionDialogController',
    size: 200,
    resolve: {
      baseUrl: function () {
        return baseUrl;
      },
      from: function () {
        return from;
      },
      to: function () {
        return to;
      },
      refresh: function () {
        return refresh;
      }
    }
  });
}
