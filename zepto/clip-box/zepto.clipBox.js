/*!     
        zepto.clipBox.js
        v 1.0
        David
        http://www.CodingSerf.com

        插件公开两个方法用于切换图片(下例)：

        var clipBox = $('.clipBox').clipBox({imgScale: 0.8}); //图片缩放0.8显示
        $('.prev').on('click',function(e){
            clipBox.prev(); //前一张
            return false; //可能是a标签，注意返回false
        });
        $('.next').on('click',function(e){
            clipBox.next(); //后一张
            return false; //可能是a标签，注意返回false
        });
*/
;(function($){
    $.fn.clipBox = function(option){
        var opts = $.extend({}, $.fn.clipBox.defaults, option), //配置选项
            $this = this,
            clipBoxStylePosition = $this.css('position'),
            boxWidth = $this.width(),
            boxHeight = $this.height(),
            $imgs = this.find('img'),//.css({'width':opts.imgScale*100+'%', 'height': 'auto'}),
            imgsLength = $imgs.length,
            imgsInfo = [],
            currIndex = 0,
            top_z_index = 100,
            startX = 0,
            startY = 0;

        //初始化
        $this.css({'overflow':'hidden'});
        clipBoxStylePosition == 'absolute' || clipBoxStylePosition == 'fixed' || ($this.css({'position':'relative'}));
        for (var i = 0, $img, imgW, imgH, wGap, hGap, initX, initY; i<imgsLength; i++) {
            $img = $imgs.eq(i);

            imgW = $img.width()*opts.imgScale;
            imgH = $img.height()*opts.imgScale;

            wGap = boxWidth - imgW;
            hGap = boxHeight - imgH;

            initX = wGap/2;
            initY = hGap/2;

            imgsInfo[i] = {};
            imgsInfo[i].initPosition = {x: initX, y: initY};
            imgsInfo[i].currPosition = {x: initX, y: initY};
            imgsInfo[i].bounce = {x0: 0, y0: 0, x1: wGap, y1: hGap};

            $img.css({
                'position':'absolute',
                'left':0,
                'top': 0,
                'width': imgW,
                'height': imgH
            }).hide();
            setPosition($img, initX, initY);
        };
        $imgs.eq(0).css({'z-index':top_z_index}).show();
        
        //注册事件
        $this.on('touchstart',function(e){
            var touch = e.touches[0];

            startX = touch.clientX;
            startY = touch.clientY;

            e.stopImmediatePropagation(); //阻止页面在clipBox区域触发滚动
        }).on('touchmove',function(e){
            var $currImg = $imgs.eq(currIndex),
                imgInfo = imgsInfo[currIndex],
                touch = e.touches[0],
                moveX = touch.clientX,
                moveY = touch.clientY,
                targetX = moveX - startX + imgInfo.currPosition.x,
                targetY = moveY - startY + imgInfo.currPosition.y,
                isOutOfBounceX = targetX<=imgInfo.bounce.x1 || targetX >=imgInfo.bounce.x0,
                isOutOfBounceY = targetY<=imgInfo.bounce.y1 || targetY >=imgInfo.bounce.y0;
            
            isOutOfBounceX && (targetX = imgInfo.currPosition.x);
            isOutOfBounceY && (targetY = imgInfo.currPosition.y);

            startX = moveX;
            startY = moveY;

            //$currImg.css({'left':targetX, 'top': targetY});
            setPosition($currImg, targetX, targetY);
            imgInfo.currPosition = {x: targetX, y: targetY};

            e.stopImmediatePropagation(); //阻止页面在clipBox区域触发滚动
            e.preventDefault();
        }).on('touchend',function(e){
            e.stopImmediatePropagation(); //阻止页面在clipBox区域触发滚动
        });

        //用transform设置位置

        function setPosition($e, x, y){
            $e.css({
                '-webkit-transform': 'translate('+x+'px,'+y+'px)',
                '-moz-transform': 'translate('+x+'px,'+y+'px)',
                '-ms-transform': 'translate('+x+'px,'+y+'px)',
                '-o-transform': 'translate('+x+'px,'+y+'px)',
                'transform': 'translate('+x+'px,'+y+'px)'
            });
        }
        //切换图片
        function switchImg(flag){
            var switchIndex = currIndex + flag,
                imgInfo,
                initPosition;
            
            switchIndex < 0 && (switchIndex = imgsLength-1);
            switchIndex > imgsLength-1 && (switchIndex = 0);

            imgInfo = imgsInfo[switchIndex];
            initPosition = imgInfo.initPosition;
            imgInfo.currPosition = {x:initPosition.x, y:initPosition.y},
            
            //$imgs.eq(switchIndex).css({'z-index':top_z_index,'left':initPosition.x, 'top':initPosition.y}).show();

            setPosition($imgs.eq(switchIndex).css({'z-index':top_z_index}).show(),initPosition.x,initPosition.y);
            $imgs.eq(currIndex).css({'z-index':''}).hide();
            currIndex = switchIndex;
        };
        //链式返回
        this.prev = function(){
            switchImg(-1);
        };
        this.next = function(){
            switchImg(+1);
        };
        return this;
    };
    $.fn.clipBox.defaults = {
        imgScale: 1 //图片缩放比例0.0~1.0，图片会按实际尺寸缩放，而不是参考父层div
    };
})(Zepto);