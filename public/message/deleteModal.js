angular.module('inspinia').controller('MessageDeleteModalController',
  function ($scope, $uibModalInstance, message, messages, baseUrl, innergerbil, toaster) {
    $scope.message = message;
    $scope.messages = messages;
    $scope.baseUrl = baseUrl;

    $scope.ok = function () {
      return innergerbil.deleteResource($scope.baseUrl, $scope.message).then(function (response) {
        var events = $scope.messages;
        var index = events.indexOf(event);
        events.splice(index, 1);
        if(response.statusCode == 200) {
          $uibModalInstance.close();
          toaster.pop('success', 'Bericht verwijderd', 'Je bericht is correct verwijderd.');
        } else {
          console.error('Delete failed : status code ' + response.statusCode);
        }
      }).catch(function (response) {
        console.error('Unable to delete item ' + message.$$meta.permalink + '. statusCode: ' + response.statusCode);
      });

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
