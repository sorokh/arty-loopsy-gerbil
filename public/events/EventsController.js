function EventsController($scope, innergerbil, $q) {
  // TODO: use "me" as party in call to forDescendantsOfParties
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849'; // LETS Dendermonde
  var letsLebbeke = '/parties/aca5e15d-9f4c-4c79-b906-f7e868b3abc5';

  $scope.classic = true;

  $scope.keywords = '';
  $scope.distance = 8;
  $scope.groups = 'local';
  $scope.search = '';

  $scope.events = [];

  $scope.availableTags = ['Eten en Drinken', 'Artisanaal', 'Gezondheid en Verzorging', 'Herstellingen', 'Huishouden', 'Klussen', 'Tuin', 'Vervoer', 'Hergebruik'];
  $scope.request = false;

  $scope.clearMessage = function() {
    $scope.newmessage = {
      tags: [],
      photos: []
    };
  }
  $scope.clearMessage();

/*  $scope.update = function() {
    sync = function(array, item, shouldBePresent) {
      if (shouldBePresent) {
        if (array.indexOf(item) == -1) {
          array.push(item);
        }
      }
      else {
        var index = array.indexOf(item);
        if (index != -1) {
          array.splice(index, 1);
        }
      }

    }
    sync($scope.multipleDemo.colors, "Vraag", $scope.request);
    sync($scope.multipleDemo.colors, "Aanbod", $scope.offer);
  };
*/

  function convertToTag(message, key, expected) {
    if(expected === message[key]) {
      if(!message.tags) {
        message.tags = [];
      }
      message.tags.push(expected);
    }
  }

  $scope.reload = function() {
    var promises = [];

    promises.push(innergerbil.getListResourcePaged($scope.baseUrl + '/messages', {
      postedInDescendantsOfParties: groupParty,
      expand: 'results.author',
      orderBy: 'modified',
      descending: true
    }));

    return $q.all(promises).then(function(results) {
      $scope.events = $scope.events,results[0].results;

      console.log('$scope.events ->');
      console.log($scope.events); // eslint-disable-line
    });
  }

  $scope.saveMessage = function() {
    var now = new Date();
    var messageuuid = innergerbil.generateGUID();
    var messagepartyuuid = innergerbil.generateGUID();
    var messageurl = '/messages/' + messageuuid;
    var messagepartyurl = '/messageparties/' + messagepartyuuid;
    var batchurl = $scope.baseUrl + '/batch';
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
    $scope.newmessage.author = { href: $scope.me.$$meta.permalink };
    $scope.newmessage.key = messageuuid;

    messageparty = {
      message: { href: messageurl },
      party: { href: letsLebbeke },
      key: messagepartyuuid
    };

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

    innergerbil.createOrUpdateResource(batchurl, batch).then(function (response) {
      console.info('batch status : ' + response.status);
      return $scope.reload();
    }).then(function () {
      $scope.clearMessage();
      console.log('message cleared');
    });
  }
  $scope.reload();
};