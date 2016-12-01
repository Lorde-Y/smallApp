(function(win, doc) {
	
	// const metaViewport = document.querySelector('meta[name="viewport"]');
	// metaViewport.setAttribute("content", 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no')
	// document.documentElement.style.fontSize = document.documentElement.deviceWidth / 10 + 'px';
	const initHtmlFontSize = ()=> {
		const dpr = window.devicePixelRatio || 1;
		const scale = 1/dpr;
		const $html = document.documentElement;
		$html.setAttribute('data-dpr', dpr);
		let deviceWidth = $html.clientWidth;
		const designWidth = 375;  //按照iphone6s的逻辑像素
		if (deviceWidth >= 640) { //640*2=1280物理像素都可以访问pc端网站了
			deviceWidth = 640;
		}
		const fontSize = 100 * (deviceWidth/designWidth);
		window.fontSize = fontSize;
		$html.style.fontSize = fontSize +　'px';
	}
	initHtmlFontSize()
	win.addEventListener('resize', ()=> {
		initHtmlFontSize();
	})

	doc.addEventListener('DOMContentLoaded', ()=> {
		initHtmlFontSize()
	});


}(window, document))