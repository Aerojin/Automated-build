var XN;
;(function (jQuery, win) {
	XN = {};
	
	XN.extend = jQuery.extend;
	
	XN.namespace = function (namespace, obj, win) {
		var path = namespace.split(".");
		var target = win || window;
		while (path.length > 0) {
			var p = path.shift();
			if (!target[p]) {
				if (path.length > 0) {
					target[p] = {};
				} else {
					target[p] = obj || {};
				}
			} else {
				if (path.length == 0) {
					target[p] = jQuery.extend(target[p], obj);
				}
			}
			target = target[p];
		}
		/**命名空间注册产生的事件
			* @name XN.Core#namespace
			* @event
			* @param {String} ns 加载成功的命名空间
			* @example XN.core.on("namespace",function(ns){});
		*/
		return target;
	};
})($, window);