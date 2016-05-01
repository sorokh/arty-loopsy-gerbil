function EventsController($scope, innergerbil, $q, toaster, $uibModal) {
  // TODO: use "me" as party in call to forDescendantsOfParties
  var groupParty = '/parties/8bf649b4-c50a-4ee9-9b02-877aa0a71849'; // LETS Dendermonde
  var letsLebbeke = '/parties/aca5e15d-9f4c-4c79-b906-f7e868b3abc5';

  $scope.classic = true;

  $scope.keywords = '';
  $scope.distance = 8;
  $scope.groups = 'local';
  $scope.search = '';

  $scope.events = [];

  $scope.request = false;

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

  $scope.reload = function() {
    var messages;
    return innergerbil.getListResourcePaged($scope.baseUrl + '/messages', {
      postedInDescendantsOfParties: groupParty,
      expand: 'results.author',
      orderBy: 'modified',
      descending: true
    }).then(function (ret) {
      var reactions = [];
      var i, message;
      messages = ret.results;
      for (i=0; i<messages.length; i++) {
        message = messages[i];
        reactions = reactions.concat(arrayOfPermalinksFromArrayOfSRILinks(message.$$reactions));
      }
      return innergerbil.getPatternBatch($scope.baseUrl + '/messages?expand=results.author&hrefs=*', reactions);
    }).then(function (reactions) {
      addReactionsToMessages(messages, reactions);
      $scope.events = messages;
    });
  }

  $scope.pop = function(type, title, text){
    toaster.pop(type, title, text);
  }

  $scope.sendPrivateReply = function(event) {
    var now = new Date();
    var newmessageguid = innergerbil.generateGUID();
    var newmessageurl = '/messages/' + newmessageguid;
    var newmessage = {
      $$meta: {
        permalink: newmessageurl
      },
      key: newmessageguid,
      description : event.$$newreply,
      author: {
        href: $scope.me.$$meta.permalink
      },
      tags: [],
      photos: [],
      created: now,
      modified: now
    };
    var newmessagerelationguid = innergerbil.generateGUID();
    var newmessagerelationurl = '/messagerelations/' + newmessagerelationguid;
    var newmessagerelation = {
      $$meta: {
        permalink: newmessagerelationurl
      },
      key: newmessagerelationguid,
      from: {
        href: newmessageurl
      },
      to: {
        href: event.$$meta.permalink
      },
      type: "response_private",
    };
    var batch = [
      {
        href: newmessageurl,
        verb: 'PUT',
        body: newmessage
      },
      {
        href: newmessagerelationurl,
        verb: 'PUT',
        body: newmessagerelation
      }
    ];

    return innergerbil.batch($scope.baseUrl, batch).then(function (result){
      console.info('result : ' + result.statusCode);
      event.$$enteringResponse = false;
      $scope.pop('success','Antwoord verstuurd.','Je bericht aan ' + event.author.$$expanded.name + ' is verstuurd.');
      $scope.reload();
    }).catch(function (error) {
      console.error('unable to create reply :');
      console.error(error);
    });
  }

  $scope.createMessage = function () {
    openCreateMessageDialog($uibModal, $scope.baseUrl, $scope.me, $scope.reload);
  }

  $scope.reload();
};