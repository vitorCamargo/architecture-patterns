/*
 * lazy
 * loads images
 */

import {addClass, hasClass} from './../utils/utils';

export function load(img){
	if(!img || hasClass(img, 'lzy')){
		return img;
	}

	if(img.getAttribute('data-src')){
		img.src = img.getAttribute('data-src');
		addClass(img, 'loaded');
	}else if(img.getAttribute('data-style')){
		img.style.cssText = img.getAttribute('data-style');
		addClass(img, 'loaded');
	}
	else{
		addClass(img, 'noimg');
	}

	return addClass(img, 'lzy');
};

export default {
	load
};
