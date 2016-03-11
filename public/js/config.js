function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/lets/start.html");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('lets', {
            abstract: true,
            url: "/lets",
            templateUrl: "common/content.html",
            controller: 'MainController'
        })
        .state('lets.events', {
            url: '/start.html',
            templateUrl: 'events/events.html'
        })
        .state('lets.messages', {
            url: '/messages.html',
            templateUrl: 'messages/messages.html'
        })
        .state('lets.message_detail', {
            url: '/message_detail.html',
            templateUrl: 'messages/message_detail.html'
        })
        .state('lets.members', {
            url: '/members.html',
            templateUrl: 'members/members.html',
            controller: 'MembersController'
        })
        .state('lets.profile', {
            url: '/profile.html',
            templateUrl: 'profile/profile.html',
            controller: 'ProfileController'
  })
        .state('lets.transactions', {
            url: '/transactions.html',
            templateUrl: 'transactions/transactions.html',
            controller: 'TransactionsController'
        });
}

angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
