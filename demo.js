;(function($) {
  demoClass = function(op) {
    this.defaults = {};
    this.ops = $.extend({},this.defaults,op);
    this.nodes = {};
    this.init();
  }

  demoClass.prototype.init = function() {
    var self = this;
    self.bindEvent();
  }

  demoClass.prototype.bindEvent = function() {
    var self = this;

    // 绑定：
  }
})(jQuery);
