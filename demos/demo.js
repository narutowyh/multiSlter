demoClass = function(op) {
    this._init();
}

demoClass.prototype._init = function() {

    // simple
    new MultiSlter({
        openSlter : "#simple",
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
            MultiSlter.getSlterData(0, 24, "", "时"),
            MultiSlter.getSlterData(0, 60, "", "分"),
            MultiSlter.getSlterData(0, 60, "", "秒"),
        ]
    });

    // separator
    new MultiSlter({
        openSlter : "#separator",
        datas : [
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ]
    });

    new MultiSlter({
        openSlter : "#separator2",
        separator : "/",
        datas : [
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ]
    });

    // sltedClassName
    new MultiSlter({
        openSlter : "#sltedClassName",
        sltedClassName : "cur",
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ]
    });


    // cancleTip
    new MultiSlter({
        openSlter : "#cancleTip",
        cancleTip : "？取消？",
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ]
    });

    // slideDownInterval
    new MultiSlter({
        openSlter : "#slideDownInterval",
        slideDownInterval : 500,
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ]
    });

    // autoScrollInterval
    new MultiSlter({
        openSlter : "#autoScrollInterval",
        autoScrollInterval : 3000,
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ]
    });

    // cancleCallback
    new MultiSlter({
        openSlter : "#cancleCallback",
        autoScrollInterval : 3000,
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ],
        cancleCallback : function(sltedLiAry, slterObj) {
            alert("cancled!");
        }
    });

    // confirmCallback
    new MultiSlter({
        openSlter : "#confirmCallback",
        autoScrollInterval : 1000,
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ],
        confirmCallback : function(sltedLiAry, slterObj) {
            return {
                autoInster : false,
                autoHide : true
            }
        }
    });

    // liTapCallback
    new MultiSlter({
        openSlter : "#liTapCallback",
        autoScrollInterval : 1000,
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ],
        liTapCallback : function(thisLiNode, ulItem, sltedAry, scroller, allScrollers) {
            return false;
        }
    });

    // placeholder
    new MultiSlter({
        openSlter : "#placeholder",
        autoScrollInterval : 1000,
        datas : [
            MultiSlter.getSlterData(1900, 2020, "", "年"),
            MultiSlter.getSlterData(1, 12, "", "月"),
            MultiSlter.getSlterData(1, 28, "", "日"),
        ]
    });

}
