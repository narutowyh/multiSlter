;(function($) {
    var _MultiSlter = function(op) {
        this.defaults = {
            autoScrollInterval : 500,        // 打开控件后自动滚动到选中元素的动画时长
            slideDownInterval  : 0,          // 组件隐藏时slide down的时长，ms
            datas              : null,       // * 用于初始化组件的数据
            cancleTip          : "请选择",    // 取消选择的文案，即顶端li节点的文案
            separator          : "-",        // 多个selector字段用什么分割
            sltedClassName     : "selected"  // 选中的li节点的className
        };
        this.ops = $.extend({}, this.defaults, op);
        this.nodes = {
            multiSlterMask : $("#multiSlterMask"),  // 遮罩单例，js初始化
            multislterItem : null,                  // 一个scroller，js生成
            openNode       : $(this.ops.openSlter), // 用于打开组件的节点选择器，不传时请调用实例的@show方法打开组件
            cancleBtn      : null,                  // 取消按钮，js生成
            confirmBtn     : null                   // 确认按钮，js生成
        };
        this.scrollObj = []; // 存放scroller对象的数组
        this.sltedAry = null;
        this.innerHeight = window.innerHeight;
        this._init();
    }

    _MultiSlter.prototype._init = function() {
        this._initScrollItems();
        this._bindEvent();
    }

    _MultiSlter.prototype._bindEvent = function() {
        var self = this;

        // 组件打开时禁用系统原生滚动
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
            var sltedAry = $(self.scrollObj[0].scroller.parentNode.parentNode).find("." + self.ops.sltedClassName);
            self.ops.cancleCallback && self.ops.cancleCallback(sltedAry, self);
            self.hide();
        });

        // 绑定： 点击确定
        self.nodes.confirmBtn.on("click", function(e) {
            self.sltedAry = $(self.scrollObj[0].scroller.parentNode.parentNode).find("." + self.ops.sltedClassName);
            var confirmResult = {
                autoInster : true,
                autoHide : true
            };
            if (self.ops.confirmCallback) {
                confirmResult = $.extend({}, confirmResult, self.ops.confirmCallback(self.sltedAry, self));
            }
            var resultHtml = ""; // 用户选择的结果
            $.each( self.scrollObj, function(k, scroller) {
                var sltedHtml = $(scroller.scroller).children("." + self.ops.sltedClassName).html();
                if (sltedHtml !== self.ops.cancleTip) {
                    resultHtml += sltedHtml + self.ops.separator;
                }
            } );
            if ( confirmResult.autoInster ) {
                var pattern = new RegExp(self.ops.separator + "$");
                self.nodes.openNode.html( resultHtml.replace(pattern, "") );

                // 对@openNode进行模拟placeholder
                if ( resultHtml === "" ) {
                    self.nodes.openNode.html( self.nodes.openNode.attr("data-holder") ).addClass("multislter-holder");
                } else {
                    self.nodes.openNode.removeClass("multislter-holder");
                }
            }
            if ( confirmResult.autoHide ) {
                self.hide();
            }
        });
    }

    // 将 @self.ops.datas 中的数据拼成ul节点，插入到@#multiSlterMask中
    _MultiSlter.prototype._initScrollItems = function() {
        var self = this;

        // @openNode没有“data-holder”时将其html设为holder
        if (!self.nodes.openNode.attr("data-holder")) {
            self.nodes.openNode.attr("data-holder", self.nodes.openNode.html())
        }

        // 初始化父节点multiSlterMask遮罩单例
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
        $.each( self.ops.datas, function(k, ulItem) { // @self.ops.datas: [ [{},{}], [{},{}], ... ]

            // 初始化一系列scroller节点
            var listWrapNode = $('<div class="list-wrap"></div>');
            var ulNode = $('<ul></ul>');
            $.each( ulItem, function(k, liItem) { // @ulItem: [{}, {}, ...]

                // ul内添加li
                var liNode = $('<li></li>');
                $.each( liItem, function(liKey, liVal) { // @liItem: { htmlData : "", subs : "" }
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

    // 显示组件
    _MultiSlter.prototype.show = function() {
        var self = this;
        self.nodes.multiSlterMask.removeClass("none");
        if (navigator.userAgent.indexOf("Safari") === -1) { // 一定不是safari，不存在遮挡问题
            ;
        } else { // safari一定有，但是某些webview也有（存在高度无法计算问题），
            ;
            // 为了兼容iOS safari底栏遮挡，需手动设置mask层的高度为window.innerHeight
            self.nodes.multiSlterMask[0].style.height = window.innerHeight + "px";

            // 有键盘弹出时为真
            if ( window.innerHeight < self.innerHeight ) {
                self.nodes.multiSlterMask[0].style.height = self.innerHeight + "px";
            }
        }


        // 初始化scroll，初始化时被scroll的节点需可见，所以延迟执行
        setTimeout(function() {
            self.nodes.multislterItem.removeClass("slter-hide"); // slter-hide：用于css动画效果的className

            // 根据ul的内容初始化各个scroller
            $.each( self.nodes.multislterItem.find("ul"), function(k, ulItem) {
                if (+$(ulItem).data("scrolled") !== 1) { // 在ul节点上添加标记，让scroller只初始化一次
                    var firstLiNode = $('<li data-value="-1"></li>').html(self.ops.cancleTip);
                    $(ulItem).append('<li class="last"></li>').prepend(firstLiNode);
                    self.scrollObj[k] = new IScroll($(ulItem).parent()[0], { // 初始化并保存一个scroll
                        tap : true
                    });
                    $(ulItem).data("scrolled", "1"); // 标记此ul已初始化了scroll

                    // 给li绑定点击事件，标记选中状态，执行传入的回调将选择数据带出
                    $(ulItem).on("tap", "li", function(e) {
                        var result = true;
                        if (self.ops.liTapCallback) {
                            var sltedAry = $(self.scrollObj[0].scroller.parentNode.parentNode).find("." + self.ops.sltedClassName);
                            result = self.ops.liTapCallback(this, ulItem, sltedAry, self.scrollObj[k], self.scrollObj);
                        }
                        if (result !== false) {
                            $(this).addClass(self.ops.sltedClassName).siblings().removeClass(self.ops.sltedClassName);
                        }
                    });
                }

                // 防止screen resize后scroller报错
                self.scrollObj[k].refresh();

                // 自动滚到被选中的位置
                var initHtml = self.nodes.openNode.html();
                if ( initHtml !== self.ops.cancleTip ) {
                    self.sltersGoTo( initHtml.split(self.ops.separator) );
                }

            } );

            // onshow
            self.ops.showCallback && self.ops.showCallback(self);
            self.preventTouchmove = true;
        }, 10);
    }

    // 隐藏组件
    _MultiSlter.prototype.hide = function() {
        var self = this;
        self.nodes.multislterItem.addClass("slter-hide");
        setTimeout(function() {
            if (self.ops.autoScrollInterval) {
                $.each( self.scrollObj, function(k, scroller) {
                    var liEle = $(scroller.scroller).children()[0];
                    scroller.scrollToElement(liEle);
                } );
            }
            self.nodes.multiSlterMask.addClass("none");
        }, self.ops.slideDownInterval);
        self.preventTouchmove = false;
    }

    // @ary为数组，包含n个selecter要被滚动到的位置
    _MultiSlter.prototype.sltersGoTo = function(ary) {
        var self = this;
        var sltedAry = ary;
        var isNode = false;
        if (self.scrollObj.length !== ary.length && self.sltedAry) {
            sltedAry = self.sltedAry;
            isNode = true;
        }
        $.each( self.scrollObj, function(k, scroller) {
            var lis = $(scroller.scroller).children();
            var liEle = lis[0];
            for (var i = 0, len = lis.length; i < len; ++i) {
                var val = isNode ? sltedAry[k].innerHTML : sltedAry[k];
                if ( lis[i].innerHTML === val ) {
                    liEle = lis[i];
                    break;
                }
            }

            // 滚到liEle
            if ( liEle ) {
                $(liEle).addClass(self.ops.sltedClassName).siblings().removeClass(self.ops.sltedClassName);
                scroller.scrollToElement(liEle, self.ops.autoScrollInterval);
            }
        } );
    }

    window.MultiSlter = _MultiSlter;

    // 生成slter的数组数据
    window.MultiSlter.getSlterData = function(from, to, pre, after, subk, subv) {
        var r = [];
        for (var i = from; i <= to; ++i) {
            var data = {
                htmlData : (pre || "") + i + (after || ""),
                value : i
            };
            if (subk && subv) {
                data[subk] = subv;
            }
            r.push(data);
        }
        return r;
    }

})(Zepto);
