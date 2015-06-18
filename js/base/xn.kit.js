;(function (XN, win) {
	XN.namespace("XN.Kit", {
		template: function (str, data) {
			XN.tmpCache = XN.tmpCache || {};
		
			var cache = XN.tmpCache, fn;
			str = str + '';
			if(str != ''){
				if(cache[str]){
					fn = cache[str];
				} else if( document.getElementById(str) ){
					cache[str] = fn = MX.kit.tmpl(document.getElementById(str).innerHTML);
				} else {
					cache[str] = fn = new Function("obj",
						"var p=[];" +
						"with(obj){p.push('" +

						str
							.replace(/[\r\t\n]/g, " ")				// 清空空白
							.split("<%").join("\t")					// <% → \t
							.replace(/%>([\s\S]*?)\t/g, function(match){return match.replace(/\'/g, "\\'");})
																		// 把 %> ... <% 中间的 单引号转义
							.replace(/^[\s\S]*$/, function(match){
								var firstIndexOfQuoteStart = match.indexOf('\t'),
									lastIndexOfQuoteEnd = match.lastIndexOf('%>'),
									firstPartStr = match.slice(0, firstIndexOfQuoteStart),
									middlePartStr = match.slice(firstIndexOfQuoteStart, lastIndexOfQuoteEnd),
									lastPartStr = match.slice(lastIndexOfQuoteEnd);
								return firstPartStr.replace(/\'/g, "\\'") +
									middlePartStr +
									lastPartStr.replace(/\'/g, "\\'");
							})
																		// 把<% ... %> 外面的 单引号转义
							.replace(/\t=(.*?)%>/g, "',$1,'")			// \t=任意字符%> → ',任意字符,'    \t=vvv → ',vvv,'  也就是<%=vvv%>
							.split("\t").join("');")					// \t → ');
							.split("%>").join("p.push('")				// %> → p.push('
							+ "');}return p.join('');"
					);
				}
			} else {
				fn = function(){return ''};
			}

			return data ? fn( data ) : fn;
		},
		getQueryString: function (search) {
			var url = search || location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			if (url.indexOf("?") != -1) {
			  var str = url.substr(1);
			  strs = str.split("&");
			  for(var i = 0; i < strs.length; i ++) {
			     theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
			  }
			}
			return theRequest || {};
		},
		replaceMobile: function (mobile) {
			var start = 3;
			var len = 4;

			var str = mobile.substr(start, len);

			return mobile.replace(str, "****");
		},
		hideOptionMenu: function () {
			var onBridgeReady = function () {
				WeixinJSBridge.call('hideOptionMenu');
			};

			if (typeof WeixinJSBridge == "undefined"){
			    if( document.addEventListener ){
			        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			    }else if (document.attachEvent){
			        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
			        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			    }
			}else{
			    onBridgeReady();
			}
		}
	});
})(window.XN, window);