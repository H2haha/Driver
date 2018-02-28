//苹果的话返回true，安卓返回false
function isIOS(){
	if (/android/i.test(navigator.userAgent)) {
		return false;
	}

	if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
		return true;
	}
}

//判断设备并调用返回
function webGoBack(){
	if(isIOS()){
		window.webkit.messageHandlers.goBack.postMessage(null);
	}
	else{
		JavascriptInterface.goBack();
	}
}

//普通页面返回
function historyBack(){
	history.go(-1);
}


//点击参与活动按钮时
function takePart(){
	if(isIOS()){
		window.webkit.messageHandlers.takePart.postMessage(null);
	}
	else{
		JavascriptInterface.startActivityFromWeb('signin');
		webGoBack();
	}
}

//判断当前设备网络是否可用
function netWorkIsOk(){
	if(isIOS()){
		window.webkit.messageHandlers.buyCoupon.postMessage(null);
	}
	else{
		JavascriptInterface.isnetwork();
	}

}

//接口地址
var baseUrl ="/dingding-web/";

//获取规则详情的url
var ruleUrl = '/dingding-web/ruleAction!getRuleDetail.action';

//获取活动详情
var activityUrl = '/dingding-web/activityAction!getActivityDetail.action';

//获取门店列表的url
var storeListUrl = '/dingding-web/storeAction!getCouponStoreList.action';

//获取积分变动列表
var inteListUrl = "/dingding-web/userMallAction!getUserIntegralList.action";

//获取订单列表
var orderListUrl = "/dingding-web/userMallAction!getCommodityOrderList.action";

// 点击查询可使用门店
function searchStore()
{
	window.location.href="/dingding-web/activityAction!pageRedirectProxy.action?bizType=store"
}

//获取参数
function getQueryStr(str) {
	var LocString = String(window.document.location.href);
	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
		tmp;
	if (tmp = rs) {
		return tmp[2];
	}
	// parameter cannot be found 
	return "";
}
//rem网页自适配
(function(doc, win) {
        var _root = doc.documentElement,
            resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize',
            resizeCallback = function() {
                var clientWidth = _root.clientWidth,
                    fontSize = 10 * 10;
                if (!clientWidth) return;
                if (clientWidth < 1080) {
                    fontSize = 100 * (clientWidth / 750);
                } else {
                    fontSize = 100 * (1080 / 750);
                }
                _root.style.fontSize = fontSize + 'px';
            };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvent, resizeCallback, false);
        doc.addEventListener('DOMContentLoaded', resizeCallback, false);
    })(document, window);