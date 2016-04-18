function EventsController($scope, innergerbil, $q, toaster) {
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

  $scope.setCurrentEvent = function(event) {
    $scope.currentEvent = event;
    console.log("currentEvent :" + $scope.currentEvent);
  }

  $scope.saveMessage = function() {
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
    $scope.newmessage.author = { href: $scope.me.$$meta.permalink };
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
      console.info('batch status : ' + response.status);
      return $scope.reload();
    }).then(function () {
      $scope.clearMessage();
      $scope.pop('success','Bericht aangemaakt !','Je bericht is correct opgeslagen.');
    });
  }

  $scope.createTransaction = function(event) {
    var transaction;
    var transactionGuid = innergerbil.generateGUID();
    var transactionUrl = '/transactions/' + transactionGuid;
    transaction = {
      $$meta: {
        permalink: transactionUrl
      },
      key: transactionGuid,
      from: {
        href: $scope.me.$$meta.permalink,
      },
      to: {
        href: event.author.href,
        $$expanded: event.author.$$expanded
      },
      amount: event.$$newTransactionAmount
    };

    return innergerbil.createOrUpdateResource($scope.baseUrl, transaction).then(function (result){
      console.info('result : ' + result.statusCode);
      event.$$enteringTransaction = false;
      $scope.pop('success','Transactie aangemaakt.','Je hebt ' + transaction.amount + ' punt(en) gewaardeerd aan ' + transaction.to.$$expanded.name);
    }).catch(function (response) {
      console.error('unable to create transaction ' + response.error);
    });
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

  $scope.reload();
};