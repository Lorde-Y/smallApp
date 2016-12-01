export default {
	getMousePosition (event) {
		return {
			x: event.pageX - (window.scrollX || window.pageXOffset),
			y: event.pageY - (window.scrollY || window.pageYOffset)
		};
	},
	pauseEvent (event) {
		event.stopPropagation();
		event.preventDefault();
	},
	addEventsToDocument (eventMap, domEle) {
		for (const key in eventMap) {
			if (domEle) {
				domEle.addEventListener(key, eventMap[key], false);
				continue;
			}
			document.addEventListener(key, eventMap[key], false)
		}
	},
	removeEventsFromDocument (eventMap, domEle) {
		for(const key in eventMap) {
			if (domEle) {
				domEle.removeEventListener(key, eventMap[key], false);
				continue;
			}
			document.removeEventListener(key, eventMap[key], false)
		}
	},
	targetIsDescendant (target, parent) {
		let node = target;
		while (node !== null) {
			if (node === parent) return true;
			node = node.parentNode
		}
		return false;
	}
}