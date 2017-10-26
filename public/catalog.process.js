function initCatalogPage(data, data341, supersalesType, staticFlag) {
    var itemMap = data.pageModel.contentBlock.itemMap;
    if (staticFlag == 0) {
        var isOutletPreview = getUrlParameter(window.location.href, 'isOutletPreview');
        if (!isOutletPreview) {
            var itemMap341 = data341.pageModel.contentBlock.itemMap;
            $.each(itemMap341, function(idx, item) {
                switch (item.blockCode) {
                    case 'SHM':
                        processMenu(item);
                        break;
                    default:
                        break;
                }
            });
        } else {
            $.each(itemMap, function(idx, item) {
                switch (item.blockCode) {
                    case 'SHM':
                        processMenu(item);
                        break;
                    default:
                        break;
                }
            });
        }
    } else if (staticFlag == 1) {
        if (supersalesType == 0) {
            $.each(itemMap, function(idx, item) {
                switch (item.blockCode) {
                    case 'SP2':
                        SP2_fn(item, supersalesType);
                        break;
                    case 'SP3':
                        SP3_fn(item);
                        break;
                    case 'SP4':
                        SP4_fn(item);
                        break;
                    case 'A34':
                        SP9_fn(item);
                        break;
                    case 'SP10':
                        SP10_fn(item);
                        break;
                    default:
                        break;
                }
            });

            if (GH.sp2Flag) {
                $('#SP2').show();
            }
            if (GH.sp3Flag) {
                $('#SP3').show();
            }
            if (!GH.sp2Flag && !GH.sp2Flag) {
                $('.light_box').hide();
            }
        } else if (supersalesType == 1) {
            $.each(itemMap, function(idx, item) {
                switch (item.blockCode) {
                    case 'SP2':
                        SP2_fn(item, supersalesType);
                        break;
                    case 'SP4':
                        SP4_fn(item);
                        break;
                    case 'A34':
                        SP9_fn(item);
                        break;
                    case 'SP10':
                        SP10_fn(item);
                        break;
                    default:
                        break;
                }
            });
            if (GH.sp2Flag) {
                $('.super_box').show();
            }
        } else if (supersalesType == 2) {
            $.each(itemMap, function(idx, item) {
                switch (item.blockCode) {
                    case 'SP4':
                        SP4_fn(item);
                        break;
                    case 'A34':
                        SP9_fn(item);
                        break;
                    case 'SP10':
                        SP10_fn(item);
                        break;
                    default:
                        break;
                }
            });
        } else if (supersalesType == 'portal') {
            var itemMap341 = data341.pageModel.contentBlock.itemMap;
            $.each(itemMap341, function(idx, item) {
                switch (item.blockCode) {
                    case 'SHM':
                        $('#SP4').empty();
                        $.each(item.cmsTabs, function(idx, cmsTab) {
                            if (cmsTab.tabId == GH.tabId) {
                                var channelPortalHtml = cmsTab.cmsOutletInfo.channelPortalHtml.replace(
                                    /(&\#160;)/g,
                                    ''
                                );
                                $('#SP4').append(channelPortalHtml);
                            }
                        });
                        break;
                    default:
                        break;
                }
            });
        }
    } else {
        if (GH.activeItem == null) {
            window.location.replace('http://www.gohappy.com.tw/5/341.html');
        }
        //SP3 改動態隨機
        if (supersalesType == 0) {
            $.each(itemMap, function(idx, item) {
                switch (item.blockCode) {
                    case 'SP3':
                        SP3_fn(item);
                        break;
                    default:
                        break;
                }
            });
        }
        //SP2計時器
        if ($('#SP2')) {
            setSP2Timer();
            refreshBuyerCount(); //人數重新計算
        }
        //SP3輪播
        if ($('#SP3')) {
            setSP3Timer();
        }
        //SP9頁面捲動
        if ($('#SP9')) {
            setSP9Timer();
        }
        //SP10
        if ($('#SP10')) {
            setSP10_Move();
        }
        $('#gotop').click(function() {
            jQuery('html,body').animate(
                {
                    scrollTop: 0
                },
                800
            );
        });
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                $('#gotop').fadeIn('fast');
            } else {
                $('#gotop')
                    .stop()
                    .fadeOut('fast');
            }
        });
        $('.hotSale_box > .head').toggle(
            function() {
                $('.hotSale_box > .content')
                    .show()
                    .animate({ width: '196px' }, 300);
                $(this)
                    .children('.tip')
                    .addClass('act');
            },
            function() {
                $('.hotSale_box > .content').animate({ width: '0px' }, 300, function() {
                    $('.hotSale_box > .content').hide();
                });
                $(this)
                    .children('.tip')
                    .removeClass('act');
            }
        );
    }
}
function SP2_fn(item, supersalesType) {
    try {
        if (!isValidCmsItems(item)) return false;
        if (!item.cmsTabs) return false;
        if (!item.cmsTabs[0].cmsItems) return false;
        if (!GH.activeItem) {
            return false;
        }

        var sp2item = findCmsItems(item.cmsTabs[0].cmsItems, sorter('modifyTime', false, 'itemId', false));
        var item = sp2item[0];
        var startTime = new Date(GH.activeItem.startTime);
        var endTime = new Date(GH.activeItem.endTime);
        var start_M = startTime.getMonth() + 1;
        var start_D = startTime.getDate();
        var end_M = endTime.getMonth() + 1;
        var end_D = endTime.getDate();
        var $topicBox = $('#SP2 .dataBox .topicBox');
        var $topicData = $topicBox.find('.topicData');

        $topicData.find('.date').text(start_M + '/' + start_D + ' ~');
        $topicData.find('.todate').text(end_M + '/' + end_D);
        $('#SP2 .tip').attr('endtime', GH.activeItem.endTime);
        if (item.cmsItemOutlet) {
            $topicData.find('.discount').text(item.cmsItemOutlet.discount);
            $topicData.find('.unit').text(item.cmsItemOutlet.unit);
            $topicData.find('.people').text(item.cmsItemOutlet.cumulateBuyers);

            if (supersalesType == 0) {
                $('#SP2 .news').text(item.cmsItemOutlet.slogan);
            } else if (supersalesType == 1) {
                $('#SP2 .eventTxt1').text(item.cmsItemOutlet.slogan);
            }
        }
        //修改 新舊取圖檔方式
        if (item.img.indexOf('images') != -1) {
            $('#SP2 .leftImg').attr('src', '//www.gohappy.com.tw' + item.img);
            $("meta[property='og\\:image']").attr('content', '//www.gohappy.com.tw' + item.img);
        } else {
            $('#SP2 .leftImg').attr('src', checkImgSrc(item.img));
            $("meta[property='og\\:image']").attr('content', checkImgSrc(item.img));
        }
        $('#SP2 .leftImg').attr('alt', GH.activeItem.itemName);
        //圓標
        if (data.pageModel.contentBlock.itemMap['SP12']) {
            $('#SP2 .roundel').remove();
            var sp12 = data.pageModel.contentBlock.itemMap['SP12'].cmsTabs[0].cmsItems[0];
            var roundelHtml =
                '<div class="roundel ' + sp12.symbolName + '"><span class="salekit">' + sp12.itemName + '</span></div>';
            $('#SP2 .leftImg').before(roundelHtml);
        }

        //活動方式
        $('#SP2 .news').text(item.slogan);
        GH.sp2Flag = true;
    } catch (e) {}
}

function setSP2Timer() {
    if (!checkBlock(data, 'SP2')) {
        return false;
    }
    var endTime = new Date($('#SP2 .tip').attr('endtime'));
    var $topicBox = $('#SP2 .topicBox');
    $topicBox
        .find('.brandlogo')
        .attr(
            'src',
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDQgNDQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0IDQ0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDpub25lO30NCgkuc3Qxe2ZpbGw6IzY2NjY2Njt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTAsMGg0NHY0NEgwVjB6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzguOSw5LjNsLTUuNi00LjdjLTAuOC0wLjctMi0wLjYtMi42LDAuMmwwLDBjLTAuNywwLjgtMC42LDIsMC4yLDIuNmw1LjYsNC43YzAuOCwwLjcsMiwwLjYsMi42LTAuMmwwLDANCglDMzkuOCwxMS4xLDM5LjcsOS45LDM4LjksOS4zeiBNMTMuMyw0LjhMMTMuMyw0LjhjLTAuNy0wLjgtMS44LTAuOS0yLjYtMC4yTDUuMSw5LjNjLTAuOCwwLjctMC45LDEuOC0wLjIsMi42bDAsMA0KCWMwLjcsMC44LDEuOCwwLjksMi42LDAuMmw1LjYtNC43QzEzLjgsNi44LDEzLjksNS42LDEzLjMsNC44eiBNMjIuOSwxNC43aC0yLjh2MTFsOC43LDUuMmwxLjQtMi4zbC03LjMtNC4zDQoJQzIyLjksMjQuMywyMi45LDE0LjcsMjIuOSwxNC43eiBNMTkuNyw3LjVjLTcuMywxLTEzLjIsNi45LTE0LjEsMTQuMmMtMS4zLDEwLjYsNy41LDE5LjcsMTguMiwxOC42QzMxLDM5LjUsMzcsMzMuOSwzOC4yLDI2LjgNCglDNDAuMiwxNS42LDMwLjgsNiwxOS43LDcuNXogTTI0LjUsMzYuNGMtOSwxLjctMTYuOC02LjEtMTUuMS0xNS4xYzEtNS4xLDUtOS4xLDEwLjEtMTAuMWM5LTEuNywxNi44LDYuMSwxNS4xLDE1LjENCglDMzMuNiwzMS40LDI5LjYsMzUuNCwyNC41LDM2LjR6Ii8+DQo8L3N2Zz4NCg=='
        );

    $.fn.countDown = function(options) {
        config = {};
        $.extend(config, options);

        diffSecs = this.setCountDown(config);

        $('#' + $(this).attr('id') + ' .digit').html('<div class="top"></div><div class="bottom"></div>');
        $(this).doCountDown($(this).attr('id'), diffSecs, 500);

        if (config.onComplete) {
            $.data($(this)[0], 'callback', config.onComplete);
        }
        if (config.omitWeeks) {
            $.data($(this)[0], 'omitWeeks', config.omitWeeks);
        }
        return this;
    };

    $.fn.stopCountDown = function() {
        clearTimeout($.data(this[0], 'timer'));
    };

    $.fn.startCountDown = function() {
        this.doCountDown($(this).attr('id'), $.data(this[0], 'diffSecs'), 500);
    };

    $.fn.setCountDown = function(options) {
        var targetTime = new Date();

        if (options.targetDate) {
            targetTime.setDate(options.targetDate.day);
            targetTime.setMonth(options.targetDate.month - 1);
            targetTime.setFullYear(options.targetDate.year);
            targetTime.setHours(options.targetDate.hour);
            targetTime.setMinutes(options.targetDate.min);
            targetTime.setSeconds(options.targetDate.sec);
        } else if (options.targetOffset) {
            targetTime.setDate(options.targetOffset.day + targetTime.getDate());
            targetTime.setMonth(options.targetOffset.month + targetTime.getMonth());
            targetTime.setFullYear(options.targetOffset.year + targetTime.getFullYear());
            targetTime.setHours(options.targetOffset.hour + targetTime.getHours());
            targetTime.setMinutes(options.targetOffset.min + targetTime.getMinutes());
            targetTime.setSeconds(options.targetOffset.sec + targetTime.getSeconds());
        }

        var nowTime = new Date();
        var diffSecs;
        if (options.targetDate.Tday) {
            targetTime = new Date(options.targetDate.Tday);
            diffSecs = Math.floor((targetTime.getTime() - nowTime.getTime()) / 1000);
        } else {
            diffSecs = Math.floor((targetTime.getTime() - nowTime.getTime()) / 1000);
        }
        $.data(this[0], 'diffSecs', diffSecs);

        return diffSecs;
    };

    $.fn.doCountDown = function(id, diffSecs, duration) {
        $this = $('#' + id);
        if (diffSecs <= 0) {
            diffSecs = 0;
            if ($.data($this[0], 'timer')) {
                clearTimeout($.data($this[0], 'timer'));
            }
        }

        secs = diffSecs % 60;
        mins = Math.floor(diffSecs / 60) % 60;
        hours = Math.floor(diffSecs / 60 / 60) % 24;
        if ($.data($this[0], 'omitWeeks') == true) {
            days = Math.floor(diffSecs / 60 / 60 / 24);
            weeks = Math.floor(diffSecs / 60 / 60 / 24 / 7);
        } else {
            days = Math.floor(diffSecs / 60 / 60 / 24) % 7;
            weeks = Math.floor(diffSecs / 60 / 60 / 24 / 7);
        }
        if (days > 99) {
            days = 99;
        }
        $this.dashChangeTo(id, 'seconds_dash', secs, duration ? duration : 800);
        $this.dashChangeTo(id, 'minutes_dash', mins, duration ? duration : 1200);
        $this.dashChangeTo(id, 'hours_dash', hours, duration ? duration : 1200);
        $this.dashChangeTo(id, 'days_dash', days, duration ? duration : 1200);
        //$this.dashChangeTo(id, 'weeks_dash', weeks, duration ? duration : 1200);

        $.data($this[0], 'diffSecs', diffSecs);
        if (diffSecs > 0) {
            e = $this;
            t = setTimeout(function() {
                e.doCountDown(id, diffSecs - 1);
            }, 1000);
            $.data(e[0], 'timer', t);
        } else if ((cb = $.data($this[0], 'callback'))) {
            $.data($this[0], 'callback')();
        }
    };

    $.fn.dashChangeTo = function(id, dash, n, duration) {
        $this = $('#' + id);
        d2 = n % 10;
        d1 = (n - n % 10) / 10;

        if ($('#' + $this.attr('id') + ' .' + dash)) {
            $this.digitChangeTo('#' + $this.attr('id') + ' .' + dash + ' .digit:first', d1, duration);
            $this.digitChangeTo('#' + $this.attr('id') + ' .' + dash + ' .digit:last', d2, duration);
        }
    };

    $.fn.digitChangeTo = function(digit, n, duration) {
        if (!duration) {
            duration = 800;
        }
        if ($(digit + ' div.top').html() != n + '') {
            $(digit + ' div.top').css({ display: 'none' });
            $(digit + ' div.top')
                .html(n ? n : '0')
                .slideDown(duration);

            $(digit + ' div.bottom').animate({ height: '' }, duration, function() {
                $(digit + ' div.bottom').html($(digit + ' div.top').html());
                $(digit + ' div.bottom').css({ display: 'block', height: '' });
                $(digit + ' div.top')
                    .hide()
                    .slideUp();
            });
        }
    };
    $('#countdown_dashboard').countDown({
        targetDate: {
            day: endTime.getDate(),
            month: endTime.getMonth() + 1,
            year: endTime.getFullYear(),
            hour: endTime.getHours(),
            min: endTime.getMinutes(),
            sec: endTime.getSeconds(),
            Tday: endTime
        },
        omitWeeks: true
    });
}
function SP3_fn(block) {
    if (!isValidCmsItems(block)) return false;
    if (!block.cmsTabs) return false;
    if (!block.cmsTabs[0].cmsItems || block.cmsTabs[0].cmsItems.length == 0) return false;

    $('#SP3').empty();
    $('#SP3').append('<div class="move_area"></div>');
    $('#SP3').append('<ul class="tabs_box"></ul>');
    $('#SP3 .move_area').append('<ul class="move_box" style="width: 1280px; left: -512px;"></ul>');
    //隨機取四個
    //var items = findCmsItems(block.cmsTabs[0].cmsItems, sorter('itemOrderNum', true), 4);
    var items = shuffle(block.cmsTabs[0].cmsItems, 4);
    $.each(items, function(idx, item) {
        //圖檔
        var $line = $('<li class="oneGroup"></li>');
        var $link = $('<a href="#" target="_blank"></a>').attr('href', item.url);
        var $img = $(defaultImg);
        $img.attr('src', checkImgSrc(item.img));
        $img.attr('title', item.itemName);
        $img.attr('alt', item.itemName);
        $link.append($img);
        $line.append($link);
        $('#SP3 .move_area .move_box').append($line);
        //文字
        var $text = $(
            '<li class="rollBox-control_' +
                (idx + 1) +
                '" style="width: 210px; padding-left: 10px;">' +
                item.itemName +
                '</li>'
        );

        $('#SP3 .tabs_box').append($text);
    });
    GH.sp3Flag = true;
}
function setSP3Timer() {
    if (!checkBlock(data, 'SP3')) {
        return false;
    }

    var $block = $('#SP3'),
        $slides = $block.find('.move_area ul.move_box'),
        _width = $block.width(),
        $li = $slides.find('li'),
        $control = $block.find('.tabs_box'),
        _animateSpeed = 600,
        // 加入計時器, 輪播時間及控制開關
        timer,
        _showSpeed = 3000,
        _stop = false;

    // 設定 $slides 的寬(為了不讓 li 往下擠)
    $slides.css('width', ($li.length + 1) * _width);
    // 產生 li 選項
    var _str = '';
    for (var i = 0, j = $li.length; i < j; i++) {
        // 每一個 li 都有自己的 className = playerControl_號碼
        var liTxt = $('.move_box li')
            .eq(i)
            .find('a')
            .attr('title');
        _str += '<li class="rollBox-control_' + (i + 1) + '">' + liTxt + '</li>';
    }

    // 產生 ul 並把 li 選項加到其中
    var $numberLi = $control.find('li');
    // 並幫 .numbers li 加上 click 事件
    $numberLi
        .click(function() {
            var $this = $(this);
            $this
                .addClass('current')
                .stop(true, false)
                .animate(
                    {
                        width: '226px',
                        paddingLeft: '20px'
                    },
                    300
                )
                .siblings('.current')
                .removeClass('current')
                .stop(true, false)
                .animate(
                    {
                        width: '210px',
                        paddingLeft: '10px'
                    },
                    300
                );

            clearTimeout(timer);
            // 移動位置到相對應的號碼
            $slides.stop().animate({
                left: _width * $this.index() * -1
            },
            _animateSpeed,
            function() {
                // 當廣告移動到正確位置後, 依判斷來啟動計時器
                if (!_stop) timer = setInterval(GH.SP3time_fn, _showSpeed);
            });

            return false;
        })
        .eq(0)
        .click();

    // 如果滑鼠移入 $slides 時
    $slides.hover(
        function() {
            // 關閉開關及計時器
            _stop = true;
            clearTimeout(timer);
        },
        function() {
            // 如果滑鼠移出 $block 時
            // 開啟開關及計時器
            _stop = false;
            timer = setInterval(GH.SP3time_fn, _showSpeed);
        }
    );
    $control.hover(
        function() {
            // 關閉開關及計時器
            _stop = true;
            clearTimeout(timer);
        },
        function() {
            // 如果滑鼠移出 $block 時
            // 開啟開關及計時器
            _stop = false;
            timer = setInterval(GH.SP3time_fn, _showSpeed);
        }
    );
    // 計時器使用
    GH.SP3time_fn = function() {
        var _index = $numberLi.filter('.current').index();
        $control.find('li.rollBox-control_' + ((_index + 1) % $numberLi.length + 1)).click();
    };
}
function SP4_fn(block) {
    if (!isValidCmsItems(block)) return false;
    if (!block.cmsTabs) return false;
    if (!block.cmsTabs[0].cmsItems) return false;
    $('#SP4').empty();
    var sp4item = findCmsItems(block.cmsTabs[0].cmsItems, sorter('modifyTime', false, 'itemId', false));
    if (sp4item[0].cmsItemOutlet && sp4item[0].cmsItemOutlet.edmContent) {
        var edmContent = block.cmsTabs[0].cmsItems[0].cmsItemOutlet.edmContent.replace(/(&\#160;)/g, '');
        $('#SP4').append(edmContent);
    }
}
function SP9_fn(item) {
    if (!isValidCmsItems(item)) return false;
    if (!item.cmsTabs) return false;
    if (!item.cmsTabs[0].cmsItems) return false;
    //清空DIV重組
    var sel1 = '#SP9';
    $(sel1).empty();
    $(sel1).append(
        '<div class="head"><img src="' +
            GH.localWebPath +
            '/supersales/images/titlebar_001.gif" width="1200" height="25"></div>'
    );
    //TODO LOCAL
    //	$(sel1).append('<div class="head"><img src="images/titlebar_001.gif" width="1200" height="25"></div>');
    //塞內容
    $(sel1 + ' ').append('<div class="move_area"></div>');
    $(sel1 + ' .move_area').append('<div class="content"></div>');
    $(sel1 + ' .move_area .content').append('<div class="left_btn"></div><div class="right_btn"></div>');
    $(sel1 + ' .move_area .content').append('<ul class="move_box" style="left: 0px;"></ul>');
    //塞右邊輪播
    var a34items = findCmsItems(item.cmsTabs[0].cmsItems, sorter('itemOrderNum', true, 'modifyTime', false), 20);
    var firstTab = item.cmsTabs[0];
    $.each(a34items, function(j, items) {
        //判斷item是否為6的倍數如果是就代表要新增一個群駔
        if (j % 4 == 0) {
            var groupHTML = "<li class='oneGroup'><ol></ol></li>";
            $(sel1 + ' .move_area .content .move_box').append(groupHTML);
        }

        //組DOM
        var liHTML = '<li>';
        liHTML += "    <a title='" + items.imgAlt + "' href='" + items.url + "'>";
        items.img = checkImgSrc(items.img);
        liHTML +=
            "        <img src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=' data-src='" +
            items.img +
            GH.rt +
            "' title='" +
            replaceEscape_fn(items.imgAlt) +
            "' categoryId='" +
            firstTab.tabCategoryId +
            "' blockId='" +
            a34items.blockId +
            "' tabId='" +
            firstTab.tabId +
            "' itemId='" +
            items.itemId +
            "' export='img'>";
        liHTML +=
            "        <p class='prodname'><span>" +
            replaceEscape_fn(items.brandName) +
            '</span><br><span>' +
            replaceEscape_fn(items.actionName) +
            '</span></p>';
        liHTML +=
            "        <p class='discount'><strong>" +
            items.discountInfo +
            '</strong>' +
            (items.symbolName ? items.symbolName : '折') +
            '起</p>';
        liHTML +=
            "        <p class='deadline'><span class='tip' endtime='" +
            items.outletEndTime +
            "' starttime='" +
            items.outletStartTime +
            "' ></span>"; //為了打過靜態頁讓index.js可以再次使用套件用
        //時間套件start
        liHTML += "        		<span class='countdown_dashboard' id='countdown" + j + "'>";
        liHTML += "					<span class='dash days_dash'>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='dash_title'>天</span>";
        liHTML += '					</span>';
        liHTML += "					<span class='dash hours_dash'>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='dash_title'>時</span>";
        liHTML += '					</span>';
        liHTML += "					<span class='dash minutes_dash'>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='dash_title'>分</span>";
        liHTML += '					</span>';
        liHTML += "					<span class='dash seconds_dash'>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='digit'>0</span>";
        liHTML += "						<span class='dash_title'>秒 結束</span>";
        liHTML += '					</span> ';
        liHTML += '				</span>';
        //時間套件end
        liHTML += '        </p>';
        liHTML += '    </a>';
        liHTML += '</li>';
        $('#SP9 .oneGroup:last ol').append(liHTML);
    });
}
function setSP9Timer() {
    if (!checkBlock(data, 'SP9', 'A34')) {
        return false;
    }
    var montharray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    GH.SP9time_fn = function() {
        $.each(window['SP9Obj'], function(j, item) {
            GH.countdown(item.yr, item.month, item.day, item.h, item.m, item.s, item.target, item.start);
        });
    };
    GH.countdown = function(yr, month, day, h, m, s, _target, startTime) {
        //結束日期
        var theh = h,
            them = m,
            thes = s;

        //今天日期
        var today = new Date();
        var todayy = today.getYear();
        if (todayy < 1000) todayy += 1900;
        var todaym = today.getMonth();
        var todayd = today.getDate();
        var todayh = today.getHours();
        var todaymin = today.getMinutes();
        var todaysec = today.getSeconds();

        //換算相差秒數
        var todaystring =
            montharray[todaym] + ' ' + todayd + ', ' + todayy + ' ' + todayh + ':' + todaymin + ':' + todaysec;
        var futurestring = montharray[month - 1] + ' ' + day + ', ' + yr + ' ' + theh + ':' + them + ':' + thes;
        var dd = Date.parse(futurestring) - Date.parse(todaystring);

        //相差秒數換算成 天時分秒
        var dday = Math.floor(dd / (60 * 60 * 1000 * 24) * 1);
        var dhour = Math.floor((dd % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
        var dmin = Math.floor(((dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
        var dsec = Math.floor((((dd % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);
        if (new Date() < new Date(startTime)) {
            _target
                .parents('.deadline')
                .find('.countdown_dashboard')
                .html('尚未開始');
            return;
        } else if (dday < 0) {
            _target
                .parents('.deadline')
                .find('.countdown_dashboard')
                .html('時間到');
            return;
        } else if (dday > 30) {
            _target
                .parents('.deadline')
                .find('.countdown_dashboard')
                .html('倒數30天');
            return;
        } else if (dday > 6) {
            _target
                .parents('.deadline')
                .find('.countdown_dashboard')
                .html('倒數' + dday + '天');
            return;
        } else if (dday == 0 && dhour == 0 && dmin == 0 && dsec == 1) {
            _target
                .parents('.deadline')
                .find('.countdown_dashboard')
                .html('時間到');
            return;
        } else {
            var html = '';
            html += "<span class='dash days_dash'>";
            html += "	<span class='digit'>" + dday + '</span>';
            html += "	<span class='dash_title'>天</span>";
            html += '</span>';

            html += "<span class='dash hours_dash'>";
            html += "	<span class='digit'>" + dhour + '</span>';
            html += "	<span class='dash_title'>時</span>";
            html += '</span>';

            html += "<span class='dash minutes_dash'>";
            html += "	<span class='digit'>" + dmin + '</span>';
            html += "	<span class='dash_title'>分</span>";
            html += '</span>';

            html += "<span class='dash seconds_dash'>";
            html += "	<span class='digit'>" + dsec + '</span>';
            html += "	<span class='dash_title'>秒 </span>";
            html += '</span>';
            html += '<span>結束</span>';

            _target
                .parents('.deadline')
                .find('.countdown_dashboard')
                .html(html);
        }
    };
    window['SP9Obj'] = [];
    $.each($('#SP9 .tip'), function(j, item) {
        var getEndTime = $(item).attr('endtime');
        var getStartTime = $(item).attr('starttime');
        var yr = getEndTime.slice(0, 4),
            month = getEndTime.slice(5, 7),
            day = getEndTime.slice(8, 10),
            h = getEndTime.slice(11, 13),
            m = getEndTime.slice(14, 16),
            s = getEndTime.slice(17, 19);
        window['SP9Obj'].push({
            target: $(item),
            yr: yr,
            month: month,
            day: day,
            h: h,
            m: m,
            s: s,
            start: getStartTime
        });
    });
    if ($('#SP9 .tip').length > 0) {
        GH.SP9time_fn(); //先執行一次
        var retime = 5000; //ie8每5秒跑一次
        if (GH.ie8) retime = 1000; //其他瀏覽器每1秒跑一次
        setInterval(GH.SP9time_fn, retime);
    }

    //事件:A34區塊
    $('#SP9').on(
        {
            click: function() {
                GH.index_moveEvent($(this));
            }
        },
        '.left_btn, .right_btn'
    );
}
function SP10_fn(block) {
    if (!isValidCmsItems(block)) return false;
    if (!block.cmsTabs) return false;
    if (!block.cmsTabs[0].cmsItems) return false;

    $('#SP10 .move_area .content .move_box').empty();
    var items = findCmsItems(block.cmsTabs[0].cmsItems, sorter('itemOrderNum', true), 5);

    $.each(items, function(idx, item) {
        //圖檔
        var $line = $('<li class="oneGroup"></li>');
        var $link = $('<a href="#" target="_blank"></a>').attr('href', item.url);
        var $img = $(defaultImg);
        $img.attr('src', checkImgSrc(item.img));
        $img.attr('title', item.itemName);
        $link.append($img);
        $line.append($link);
        $('#SP10 .move_area .content .move_box').append($line);
    });
    $('#SP10').show();
}
function setSP10_Move() {
    if ($('#SP10')) {
        $('#SP10 .right_btn').click(function() {
            //右鍵
            var $parents = $(this).parents('.move_area');
            var _child = $parents.find('.move_box'),
                groupcount = _child.children('.oneGroup').length,
                groupwidth = _child.children('.oneGroup').width(),
                clickcount = parseInt($parents.find('.count').text()); //parseInt轉數字字串
            if (groupcount > clickcount) {
                _child.animate({ left: '-=' + groupwidth }, 600, 'easeInOutCubic');
                (clickcount = clickcount + 1), (ringicon = clickcount - 1);
                $parents.find('.count').text(clickcount);
                $parents
                    .find('.ringIcon_area')
                    .children('span:eq(' + ringicon + ')')
                    .addClass('in')
                    .siblings()
                    .removeClass('in');
            } else {
                (clickcount = 1), (ringicon = clickcount - 1);
                _child.animate({ left: 0 }, 600, 'easeInOutCubic');
                $parents.find('.count').text(clickcount);
                $parents
                    .find('.ringIcon_area')
                    .children('span:eq(' + ringicon + ')')
                    .addClass('in')
                    .siblings()
                    .removeClass('in');
            }
        });
        $('#SP10 .left_btn').click(function() {
            //左鍵
            var $parents = $(this).parents('.move_area');
            var _child = $parents.find('.move_box'),
                groupcount = _child.children('.oneGroup').length,
                groupwidth = _child.children('.oneGroup').width(),
                clickcount = parseInt($parents.find('.count').text()); //parseInt轉數字字串
            if (clickcount > 1) {
                _child.animate({ left: '+=' + groupwidth }, 600, 'easeInOutCubic');
                (clickcount = clickcount - 1), (ringicon = clickcount - 1);
                $parents.find('.count').text(clickcount);
                $parents
                    .find('.ringIcon_area')
                    .children('span:eq(' + ringicon + ')')
                    .addClass('in')
                    .siblings()
                    .removeClass('in');
            } else {
                (clickcount = groupcount), (ringicon = clickcount - 1);
                _child.animate({ left: '-=' + groupwidth * ringicon }, 600, 'easeInOutCubic');
                $parents.find('.count').text(clickcount);
                $parents
                    .find('.ringIcon_area')
                    .children('span:eq(' + ringicon + ')')
                    .addClass('in')
                    .siblings()
                    .removeClass('in');
            }
        });
    }
}
function refreshBuyerCount() {
    if (!checkBlock(data, 'SP2')) {
        return false;
    }
    var sp2item = findCmsItems(
        data.pageModel.contentBlock.itemMap['SP2'].cmsTabs[0].cmsItems,
        sorter('modifyTime', false, 'itemId', false)
    );
    var $people = $('#SP2 .dataBox .topicBox .topicData .people');
    $people.html('');
    $.ajax({
        cache: false,
        type: 'GET',
        async: false,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: { itemId: sp2item[0].itemId },
        url: GH.apiFront + '/getBuyerCount',
        success: function(jsonData) {
            try {
                var cmsItemOutlet = jsonData.pageModel.contentBlock.itemMap[sp2item[0].itemId];
                $people.text(cmsItemOutlet.cumulateBuyers);
            } catch (e) {
                //console.log("查無資料或格式不是JSON");
                isJSONerror = true;
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            alert('錯誤碼: ' + xhr.status);
            alert('ajax執行序: ' + xhr.readyState);
        }
    });
}
