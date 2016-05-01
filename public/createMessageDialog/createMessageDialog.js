function CreateMessageDialogController ($scope, $uibModalInstance, innergerbil, toaster, baseUrl, from, refresh) {
  'use strict';
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849'; // LETS Dendermonde
  var letsLebbeke = '/parties/aca5e15d-9f4c-4c79-b906-f7e868b3abc5';

  $scope.from = from;
  $scope.baseUrl = baseUrl;
  $scope.title = '';
  $scope.description = '';
  $scope.availableTags = ['Eten en Drinken', 'Artisanaal', 'Gezondheid en Verzorging', 'Herstellingen', 'Huishouden', 'Klussen', 'Tuin', 'Vervoer', 'Hergebruik'];
  $scope.newmessage = {
    tags: [],
    photos: []
  };

  function convertToTag(message, key, expected) {
    if(expected === message[key]) {
      if(!message.tags) {
        message.tags = [];
      }
      message.tags.push(expected);
    }
  }

  $scope.ok = function () {
    var now = new Date();
    var messageuuid = innergerbil.generateGUID();
    var messagepartyuuid = innergerbil.generateGUID();
    var messageurl = '/messages/' + messageuuid;
    var messagepartyurl = '/messageparties/' + messagepartyuuid;
    var batch;
    var messageparty;

    convertToTag($scope.newmessage, 'goodorservice', 'Goed');
    convertToTag($scope.newmessage, 'goodorservice', 'Dienst');
    convertToTag($scope.newmessage, 'offerorrequest', 'Aanbod');
    convertToTag($scope.newmessage, 'offerorrequest', 'Vraag');

    delete $scope.newmessage.goodorservice;
    delete $scope.newmessage.offerorrequest;

    $scope.newmessage.created = now;
    $scope.newmessage.modified = now;
    $scope.newmessage.author = { href: $scope.from.$$meta.permalink };
    $scope.newmessage.key = messageuuid;

    messageparty = {
      $$meta: {
        permalink: messagepartyurl
      },
      message: { href: messageurl },
      party: { href: letsLebbeke },
      key: messagepartyuuid
    };

    $scope.newmessage.$$meta = {
      permalink: messageurl
    }

    batch = [
      {
        href: messageurl,
        verb: 'PUT',
        body: $scope.newmessage
      },
      {
        href: messagepartyurl,
        verb: 'PUT',
        body: messageparty
      }
    ];

    innergerbil.batch($scope.baseUrl, batch).then(function (response) {
      if(response.statusCode === 201) {
        toaster.pop('success','Bericht aangemaakt !','Je bericht is correct opgeslagen.');
        $uibModalInstance.dismiss('ok');
        if(refresh) refresh();
      } else {
        toaster.pop('error','Bericht kon niet worden aangemaakt.','');
        console.error('Unable to create message');
        console.error(batch);
      }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

function openCreateMessageDialog ($uibModal, baseUrl, from, refresh) {
  var modalInstance = $uibModal.open({
    animation: true,
    templateUrl: 'createMessageDialog/createMessageDialog.html',
    controller: 'CreateMessageDialogController',
    size: 200,
    resolve: {
      baseUrl: function () {
        return baseUrl;
      },
      from: function () {
        return from;
      },
      refresh: function () {
        return refresh;
      }
    }
  });
}
