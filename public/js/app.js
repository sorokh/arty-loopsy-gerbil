/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */
(function () {
    angular.module('arty', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'pascalprecht.translate',       // Angular Translate
        'ngAnimate',
        'ui.select',
        'ngSanitize',
        'toaster'
    ])
})();


// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad