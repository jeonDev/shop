Vue.component('main-product', {
	template: `
		<div>
			<div class="d-flex">
				<div class="p-2">
					<h4>인기상품</h4>
				</div>
				<div class="ml-auto p-2">
					<span>
						<router-link :to="{ path: '/shop/product/list' }" class="a">전체보기</router-link>
					</span>
				</div>
			</div>
			<hr class="mt-0">
			<div class="position-relative">
				<div class="d-flex flex-no-wrap w-100" id="product-view">
					<img src="/shop/images/pre-move-btn.png" class="img-fluid pre-move-btn" @click="moveProductView('pre')"/>
					<div class="flex-auto-0 w-20 mr-3" v-for="(item, index) in productList">
						<router-link :to="{ name: 'product-detail-form', params: { productId: item.PRODUCT_ID }}" class="a">
							<div class="work-break-all" style="position: relative;">
								<img :src="item.IMG_SRC" style="height:285px;" class="img-fluid" onerror="this.src='/shop/images/img_error.png'">
								<div style="position: absolute; top:0; left: 0;" class="w-100 h-100" v-if="item.PRODUCT_CNT == 0">
									<img src="/shop/images/soldout.png" class="w-100 h-100" style="opacity: 0.5"/>
								</div>
							</div>
							<div class="work-break-all">
								{{ item.PRODUCT_NAME }}
							</div>
							<div class="d-flex justify-content-between align-items-center">
								<!--  class="d-flex work-break-all" -->
								<div>
									<span>{{ item.FINAL_PRICE.toLocaleString('ko-KR') }}원</span>
									<span class="text-secondary" style="font-size:12px" v-if="item.PRICE_DISCOUNT != 0 ">
										<del>{{ item.PRICE.toLocaleString('ko-KR') }}원</del>
									</span>
								</div>
								<span v-if="item.PRICE_DISCOUNT"
								 style="font-size:10px;" class="text-danger">{{ item.PRICE_DISCOUNT }}% 할인중</span>
							</div>
						</router-link>
					</div>
					<img src="/shop/images/next-move-btn.png" class="img-fluid next-move-btn" @click="moveProductView('next')">
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			productList : []
		}
	},
	methods : {
		getProductList(){
			let data = {"curPage" : 1
						, "pageUnit" : 20, "blockUnit" : 1
						, "order" : "sales_rate"};
			
			httpRequest({
				url: "product/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.productList = rs.data.productList;
				
				$.each(this.productList, function(idx, item){
					item.IMG_SRC = server + item.IMG_SRC;
				});
				
			})
			.catch((error) => {
				console.log(error);
			});
		},
		moveProductView(move){
			let _scroll = $('#product-view').scrollLeft();
			
			let _width = $('#product-view').width();
			let _length = $('#product-view').length;
			if(move == "pre"){
				$('#product-view').animate({
					scrollLeft : _scroll - _width
				}, 500);
			} else if(move == "next"){
				$('#product-view').animate({
					scrollLeft : _scroll + _width
				}, 500);
			}
		}
	},
	created() {
		this.getProductList();
	}
});