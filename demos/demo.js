;(function($) {
  demoClass = function(op) {
    this.defaults = {};
    this.ops = $.extend({},this.defaults,op);
    this.nodes = {};
    this.init();
  }

  demoClass.prototype.init = function() {
    var self = this;
    self.initSlters();
  }

  demoClass.prototype.initSlters = function() {
    var self = this;

    // separator可配置
    new MultiSlter({
        openSlter : "#separatorEmpty",
        separator : " ",
        datas : [self.getSlterData(1, 9, "", "室"), self.getSlterData(1, 9, "", "厅"), self.getSlterData(1, 9, "", "卫")],
        confirmCallback : function( sltedNodeAry, multiSlterObj ) {
            window.console && console.log( sltedNodeAry, multiSlterObj );
        }
    });
    new MultiSlter({
        openSlter : "#separatorS",
        separator : "-",
        datas : [self.getSlterData(1, 9, "", "室"), self.getSlterData(1, 9, "", "厅"), self.getSlterData(1, 9, "", "卫")],
        confirmCallback : function( sltedNodeAry, multiSlterObj ) {
            window.console && console.log( sltedNodeAry, multiSlterObj );
        }
    });
    new MultiSlter({
        openSlter : "#sltedClassName",
        separator : "-",
        sltedClassName : "cur",
        datas : [self.getSlterData(1, 9, "", "室"), self.getSlterData(1, 9, "", "厅"), self.getSlterData(1, 9, "", "卫")],
        confirmCallback : function( sltedNodeAry, multiSlterObj ) {
            window.console && console.log( sltedNodeAry, multiSlterObj );
        }
    });
    new MultiSlter({
        openSlter : "#cancleTip",
        separator : "-",
        cancleTip : "-取消-",
        datas : [self.getSlterData(1, 9, "", "室"), self.getSlterData(1, 9, "", "厅"), self.getSlterData(1, 9, "", "卫")],
        confirmCallback : function( sltedNodeAry, multiSlterObj ) {
            window.console && console.log( sltedNodeAry, multiSlterObj );
        }
    });
    new MultiSlter({
        openSlter : "#licallback",
        separator : "-",
        cancleTip : "--",
        liTapCallback : function( selectedLi, thisScroller, multiSlterObj ) {
          window.console && console.log( selectedLi, thisScroller, multiSlterObj );
          alert("liTapCallback demo");
        },
        datas : [self.getSlterData(1, 9, "", "室"), self.getSlterData(1, 9, "", "厅"), self.getSlterData(1, 9, "", "卫")],
        confirmCallback : function( sltedNodeAry, multiSlterObj ) {
            window.console && console.log( sltedNodeAry, multiSlterObj );
        }
    });
    new MultiSlter({
        openSlter : "#callbacks",
        separator : "-",
        cancleTip : "--",
        cancleCallback : function( sltedNodeAry, multiSlterObj ) {
          window.console && console.log( sltedNodeAry, multiSlterObj );
          alert("取消");
        },
        datas : [self.getSlterData(1, 9, "", "室"), self.getSlterData(1, 9, "", "厅"), self.getSlterData(1, 9, "", "卫")],
        confirmCallback : function( sltedNodeAry, multiSlterObj ) {
          window.console && console.log( sltedNodeAry, multiSlterObj );
            alert("确认");
        }
    });

  }

  demoClass.prototype.getSlterData = function(from, to, pre, after) {
      var r = [];
      for (var i = from; i <= to; ++i) {
          r.push({
              htmlData : (pre || "") + i + (after || ""),
              value : i
          });
      }
      return r;
  }
})(Zepto);









