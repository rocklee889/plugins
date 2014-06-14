/*!     
        jquery.responsiveSlider.js
        v 1.0
        David
        http://www.CodingSerf.com
*/

;(function($){
    $.fn.responsiveSlider = function(option){
		var opts = $.extend({}, $.fn.responsiveSlider.defaults, option), //配置选项
			$this = this,
			$slider_mask = this,
			$slider_wrap = this.find('ul'),
			$slider_items = $slider_wrap.find('li'),
			$slider_btn_prev = opts.$slider_btn_prev,
			$slider_btn_next = opts.$slider_btn_next,
			slider_item_length = $slider_items.length,
			slider_item_width = opts.slider_item_width,
			slider_btn_disableClass = opts.slider_btn_disableClass,
			slider_width = slider_item_length * slider_item_width,
			current_section_index = 0;

		$slider_wrap.width(slider_width);

		$slider_btn_next.on('click',function(e){
			moveSlider(+1);
		});
		$slider_btn_prev.on('click',function(e){
			moveSlider(-1);
		});
		$(window).on('resize',function(e){
			current_section_index = 0;
			moveSlider(-0);
		});

		function initSlider(){
			
		}

		function moveSlider(direction){ //+1 right or -1 left
			var distance = $slider_mask.width(),
				sections = Math.ceil(slider_width/distance),
				remainder = slider_item_length % (distance/slider_item_width),
				translateX = 0;

			current_section_index += direction;

			if(current_section_index <= 0){
				current_section_index = 0;
				$slider_btn_prev.addClass(slider_btn_disableClass);
				$slider_btn_next.removeClass(slider_btn_disableClass);
				translateX = 0;
			} else if(current_section_index >= sections-1){
				var rollbackIndex;

				current_section_index = sections-1;
				rollbackIndex = remainder !== 0 ? current_section_index - 1 : current_section_index;

				$slider_btn_prev.removeClass(slider_btn_disableClass);
				$slider_btn_next.addClass(slider_btn_disableClass);
				translateX = -(distance * rollbackIndex + remainder * slider_item_width);
			} else {
				$slider_btn_prev.removeClass(slider_btn_disableClass);
				$slider_btn_next.removeClass(slider_btn_disableClass);

				translateX = -distance * current_section_index;
			}
			$slider_wrap.css(getCSSTransformObj(translateX));
		}
		function getCSSTransformObj(x){
			return {
				'-webkit-transform': 'translateX('+x+'px)',
				'-moz-transform': 'translateX('+x+'px)',
				'-ms-transform': 'translateX('+x+'px)',
				'-o-transform': 'translateX('+x+'px)',
				'transform': 'translateX('+x+'px)'
			};
		}

		//链式返回
		return this;
    };
    $.fn.responsiveSlider.defaults = {
		slider_item_width: 250, //每个item的宽，在css中定义
		slider_btn_disableClass: 'slider-arrow_disable',
		$slider_btn_prev: $('.slider_btn_prev'),
		$slider_btn_next: $('.slider_btn_next')
    };
})(jQuery);