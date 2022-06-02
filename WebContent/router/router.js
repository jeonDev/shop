// routes
const routeMenus = [
	{ path: "/shop", name:"index-form", component: indexComponent},
	{ path: "/shop/product/detail/:productId", name:"product-detail-form", component: productComponent},
	{ path: "/shop/pay/list/:payInfo", name:"pay-list-form", component: payListComponent, props: true},
	{ path: "/shop/notice/:bbsNo", name:"notice-detail-form", component: noticeDetailComponent, props: true},
	{ path: "/shop/product/review/:paymentNo", name:"product-review-write-form", component: productReviewWriteComponent},
	{ path: "/shop/order/list/:orderNo", name:"order-list-form", component: orderListComponent},
	{ path: "/shop/admin/product/size/:productId", name:"admin-product-size-form", component: adminProductSizeComponent},
	{ path: "/shop/admin/product/manage/:productId", name:"admin-product-manage-form", component: adminProductManageComponent},
	{ path: "/shop/admin/bbs/write/:bbsType", name:"admin-bbs-write-form", component: adminBbsWriteComponent, props: true}
	
];

reqDataAjax("GET"
		, server + "get/menu/list"
		, "json"
		, false
		, function(rs){
			$.each(rs, function(idx, item){
				var routePath = item.LOC;
				var routeName = item.NAME;
				var routeComponent = eval(item.COMPONENT);
				if(routeComponent){
					var routeMenu = {path: routePath,
							name: routeName, component: routeComponent, props: true};
					routeMenus.push(routeMenu);
				}
			});
		}
		, "");


// Router 인스턴스 생성
const router = new VueRouter({
	// 라우터 옵션
	mode: "history",
	routes: routeMenus
});

const indexVue = new Vue({
	el : '#main',
	router : router
});