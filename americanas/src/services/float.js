import { addClass, removeClass, addListener } from './../utils/utils';

function getScrollY() {
	const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
	return Math.max(0, window.pageYOffset || (isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop));
}

export default function(element, cssClassFloat = 'float', floatUp = true, floatDown = true) {

	if(!window || !document || !element){
		return;
	}

	//setting header min-height

	const headerHeight = document.getElementById('bhd').offsetHeight;

	let scrollPrev = getScrollY();

	addClass(element, `${cssClassFloat}-enable`);
	let headerTop = document.getElementById('header-top');
	let topHeight = 0;
	if(headerTop){
		topHeight = headerTop.offsetHeight;
	}

	addListener(window, ['scroll'], function() {
    let scrollCurrent = getScrollY();
    let headerBanner  = document.getElementById('header-banner');
    let bannerHeight  = 0;

    //updating header minheight if has banner
    /*if(headerBanner){
      bannerHeight = headerBanner.offsetHeight;
      document.getElementById('bhd').style.minHeight = (headerHeight + bannerHeight + topHeight) + 'px';
    }*/

  //floating header
  scrollCurrent <= (bannerHeight + topHeight) && removeClass(element, `${cssClassFloat}`);
  (scrollCurrent > (bannerHeight + topHeight) && scrollCurrent > 0) && addClass(element, `${cssClassFloat}`);
  scrollPrev > scrollCurrent && removeClass(element, 'down') && floatUp && addClass(element, 'up');
  !feather.modules.menu.isOpen() && scrollPrev < scrollCurrent && removeClass(element, 'up') && floatDown && addClass(element, 'down');

    scrollPrev = scrollCurrent;

	});
}
