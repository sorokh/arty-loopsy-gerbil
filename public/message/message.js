function messageDirective() {
  return {
    restrict: 'E',
    scope: {
      event: '=message',
      baseUrl: '='
    },
    templateUrl: function(elem, attr){
      return 'message/message.html';
    }
  };
}