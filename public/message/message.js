function messageDirective() {
  return {
    restrict: 'E',
    scope: {
      event: '=message',
      baseUrl: '=',
      me: '='
    },
    templateUrl: function(elem, attr){
      return 'message/message.html';
    }
  };
}