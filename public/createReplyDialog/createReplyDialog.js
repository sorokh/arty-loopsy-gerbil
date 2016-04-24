function CreateReplyDialogController ($scope, $uibModalInstance, innergerbil, toaster, baseUrl, from, replyTo) {
  'use strict';
  $scope.from = from;
  $scope.replyTo = replyTo;
  $scope.baseUrl = baseUrl;
  $scope.title = '';
  $scope.description = '';

  $scope.ok = function () {
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

function openCreateReplyDialog ($uibModal, baseUrl, from, replyTo) {
  var modalInstance = $uibModal.open({
    animation: true,
    templateUrl: 'createReplyDialog/createReplyDialog.html',
    controller: 'CreateReplyDialogController',
    size: 200,
    resolve: {
      baseUrl: function () {
        return baseUrl;
      },
      from: function () {
        return from;
      },
      replyTo: function () {
        return replyTo;
      }
    }
  });
}
