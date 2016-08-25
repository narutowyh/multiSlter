;(function($, ns) {
  ns.MultiSlter = function(op) {
    this.defaults = {
      cancleTip : "请选择", // 取消选择的文案，写在@openSlter节点上，用js初始化
      separator : "－",    // 多个selector的字段用什么分割
      sltedClassName : "selected"
    };
    this.ops = $.extend({}, this.defaults, op);
    this.nodes = {
      multiSlterMask : $("#multiSlterMask"),
      multislterItem : null, // 一个scroll节点，js生成
      openNode       : $(this.ops.openSlter),
      cancleBtn      : null,
      confirmBtn     : null
    };
    this.scrollObj = [];
    this.init();
  }

  ns.MultiSlter.prototype.init = function() {
    var self = this;
    self.initScrollItems();
    self.bindEvent();
  }

  ns.MultiSlter.prototype.bindEvent = function() {
    var self = this;

    // 打开组件时阻止屏幕滑动
    document.addEventListener('touchmove', function (e) {
      if ( self.preventTouchmove ) {
        e.preventDefault();
      }
    }, false);

    // 如果传入了@openSlter：点击@openSlter打开组件；在@openSlter上模拟placeholder
    self.nodes.openNode.on("click", function(e) {
      self.show();
    });

    // 绑定：点击取消
    self.nodes.cancleBtn.on("click", function(e) {
      self.ops.cancleCallback && self.ops.cancleCallback();
      self.hide();
    });

    // 绑定： 点击确定
    self.nodes.confirmBtn.on("click", function(e) {
      if (self.ops.confirmCallback) {
        var confirmResult = self.ops.confirmCallback($(self.scrollObj[0].scroller.parentNode.parentNode).find("." + self.ops.sltedClassName), self);
      }
      var resultHtml = ""; // 选择的结果，以“－”连接
      $.each( self.scrollObj, function(k, scroller) {
        scroller.curIndex = Math.floor(Math.abs(scroller.y/scroller.pages[0][0]["height"]));
        var sltedHtml = $(scroller.scroller).children("." + self.ops.sltedClassName).html();
        if (sltedHtml !== self.ops.cancleTip) {
          resultHtml += sltedHtml + self.ops.separator;
        }
      } );
      if ( confirmResult !== false ) {
        var pattern = new RegExp(self.ops.separator + "$");
        self.nodes.openNode.html( resultHtml.replace(pattern, "") );

        // 对@openNode进行模拟placeholder
        if ( resultHtml === "" ) {
          self.nodes.openNode.html( self.nodes.openNode.attr("data-holder") ).addClass("multislter-holder");
        } else {
          self.nodes.openNode.removeClass("multislter-holder");
        }
      }
      self.hide();
    });
  }

  // 将 @self.ops.datas 中的数据拼成ul节点，插入到@#multiSlterMask中
  ns.MultiSlter.prototype.initScrollItems = function() {
    var self = this;

    // 没有“data-holder”的把html当holder
    if (!self.nodes.openNode.attr("data-holder")) {
      self.nodes.openNode.attr("data-holder", self.nodes.openNode.html())
    }

    // 初始化父节点multiSlterMask，单例
    if ( self.nodes.multiSlterMask.length === 0 ) {
      $("body").append( $('<div class="multislter-mask none" id="multiSlterMask"></div>') );
      self.nodes.multiSlterMask = $("#multiSlterMask");
    }

    var multislterItemNode = $('<div class="multislter-item slter-hide">' +
                                  '<div class="action-wrap">' +
                                      '<span class="cancleBtn">取消</span>' +
                                      '<span class="confirmBtn">确定</span>' +
                                  '</div>' +
                               '</div>');
    var slterWrapNode = $('<div class="slter-wrap"></div>');

    // 拼multislter-item
    $.each( self.ops.datas, function(k, ulItem) {
      var listWrapNode = $('<div class="list-wrap"></div>');
      var ulNode = $('<ul></ul>');
      $.each( ulItem, function(k, liItem) {
        var liNode = $('<li></li>');
        $.each( liItem, function(liKey, liVal) {
          if(liKey === "htmlData") {
            liNode.html(liVal);
          } else {
            liNode.data(liKey, liVal);
          }
        } );
        ulNode.append(liNode);
      } );
      slterWrapNode.append(listWrapNode.append(ulNode));
    } );

    multislterItemNode.append(slterWrapNode);
    self.nodes.multiSlterMask.append(multislterItemNode);
    self.nodes.multislterItem = multislterItemNode;
    self.nodes.cancleBtn = multislterItemNode.find(".cancleBtn");
    self.nodes.confirmBtn = multislterItemNode.find(".confirmBtn");
  }

  ns.MultiSlter.prototype.show = function() {
    var self = this;
    self.nodes.multiSlterMask.removeClass("none");
    setTimeout(function() {
      self.nodes.multislterItem.removeClass("slter-hide");
      // 初始化scroll，初始化时被scroll的节点需可见，所以延迟执行
      $.each( self.nodes.multislterItem.find("ul"), function(k, ulItem) {
        if (+$(ulItem).data("scrolled") !== 1) {
          var firstLiNode = $('<li></li>').html(self.ops.cancleTip);
          $(ulItem).append('<li></li>').prepend(firstLiNode).prepend('<li></li>');
          self.scrollObj[k] = new IScroll($(ulItem).parent()[0], {
            snap : "li",
            tap : true,
            momentum : false
          });
          self.scrollObj[k].on("scrollEnd", function() {
            self.handleScrollEnd(this);
          });
          $(ulItem).data("scrolled", "1"); // 标记此ul已初始化了scroll

          // 给li绑定点击事件,点击自动滚动
          $(ulItem).on("tap", "li", function(e) {
            var indexLi = $(this).parent().children().indexOf(this);
            self.ops.liTapCallback && self.ops.liTapCallback(this, self.scrollObj[k], self);
            self.scrollObj[k].goToPage(0, indexLi - 1);
          });

          // 从html里带入了初始值，将scroll按照此值初始化
          var initHtml = self.nodes.openNode.html();
          if ( initHtml !== self.ops.cancleTip ) {
            self.sltersGoTo( initHtml.split(self.ops.separator) );
          }
        }
      } );
      self.preventTouchmove = true;
      $.each( self.scrollObj, function(k, scroller) {
        var curIndex = scroller.curIndex || 0;
        scroller.goToPage(0, curIndex);
        $(scroller.scroller).children().removeClass(self.ops.sltedClassName);
        $( $(scroller.scroller).children()[curIndex + 1] ).addClass(self.ops.sltedClassName);
      } );
    }, 10);
  }

  ns.MultiSlter.prototype.hide = function() {
    var self = this;
    self.nodes.multislterItem.addClass("slter-hide");
    setTimeout(function() {
      self.nodes.multiSlterMask.addClass("none");
    }, 0);
    self.preventTouchmove = false;
  }

  // scrollEnd：
  ns.MultiSlter.prototype.handleScrollEnd = function(scroller) {
    var self = this;
    var curIndex = Math.floor(Math.abs(scroller.y/scroller.pages[0][0]["height"]));
    $(scroller.scroller).children().removeClass(self.ops.sltedClassName);
    $( $(scroller.scroller).children()[curIndex + 1] ).addClass(self.ops.sltedClassName);
  }

  // @ary为数组，包含n个selecter要被滚动到的位置
  ns.MultiSlter.prototype.sltersGoTo = function(ary) {
    var self = this;
    $.each( self.scrollObj, function(k, scroller) {
      var lis = $(scroller.scroller).children();
      var sltedLiIndex = 0;
      for (var i = 0, len = lis.length; i < len; ++i) {
        if ( lis[i].innerHTML === ary[k] ) {
          sltedLiIndex = i - 1;
          break;
        }
      }
      scroller.curIndex = sltedLiIndex;
      scroller.goToPage(0, sltedLiIndex);
    } );
  }

})(Zepto, window);
