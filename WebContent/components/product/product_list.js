const productListComponent = Vue.component('product-list-form', {
	template: `
		<div>
			<!-- Category -->
			<div class="mb-3">
				<product-list-category-form :productType="productType"/>
			</div>
			
			<!-- order -->
			<div class="container d-flex justify-content-end mb-3" style="font-size:12px;">
				<div :class="[order == '' ? 'text-danger' : 'text-secondary']" class="p-2 a" @click="orderChange('')">최신순</div>
				<div :class="[order == 'product_view' ? 'text-danger' : 'text-secondary']" class="p-2 a" @click="orderChange('product_view')">조회순</div>
				<div :class="[order == 'sales_rate' ? 'text-danger' : 'text-secondary']" class="p-2 a" @click="orderChange('sales_rate')">판매순</div>
			</div>
			
			<!-- Product List -->
			<div class="container">
				<div id="product-list" class="list-group list-group-horizontal justify-content-center" style="flex-wrap:wrap">
					<div v-for="(item, idx) in productList" class="list-group-item w-30 m-2">
						<router-link :to="{name: 'product-detail-form', params: { productId : item.PRODUCT_ID } }" class="a">
							<div style="position: relative;">
								<img :src="imgSrc(item.IMG_SRC)" class="img-fluid p-1" style="width: 400px; height : 350px;" onerror="this.src='/shop/images/img_error.png'">
								<div style="position: absolute; top:0; left: 0;" class="w-100 h-100" v-if="item.PRODUCT_CNT == 0">
									<img src="/shop/images/soldout.png" class="w-100 h-100" style="opacity: 0.5"/>
								</div>
							</div>
							<div>
								{{ item.PRODUCT_NAME }}
							</div>
							<div class="d-flex justify-content-between align-items-center">
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
					<div class="text-center w-100" v-if="productList.length == 0">
						<h2>조회된 상품이 없습니다.</h2>
					</div>
				</div>
			</div>
			
			<!-- Pagenation -->
			<pagenation-form :obj="page" @pageMove="pageMove"></pagenation-form>
		</div>
	`,
	watch: {
		$route() {
			this.productType = this.$route.query.productType;
			this.page.curPage = this.$route.query.curPage;
			this.order = this.$route.query.order;
			this.getProductList();
		}
	},
	data(){
		return{
			productList: [],
			productType: "",
			order : "",
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 9,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			}
		}
	},
	methods : {
		getProductList(){
			
			let order = this.order;
			
			let data = {curPage: this.page.curPage,
					pageUnit: this.page.pageUnit,
					blockUnit: this.page.blockUnit,
					productType: this.productType};
			
			if(order) data.order = order;
			
			httpRequest({
				url: "product/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.productList = rs.data.productList;
				this.page = rs.data.page;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		pageMove(page){
			if(page == this.page.curPage) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.curPage = page;
			this.$router.push({ query });
			
			moveAnimate("product-list");
		},
		orderChange(order){
			if(order == this.order) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.order = order;
			this.$router.push({ query });
			
			moveAnimate("product-list");
		},
		imgSrc(src){
			return server + src;
		}
	},
	created() {
		this.productType = this.$route.query.productType;
		this.page.curPage = this.$route.query.curPage;
		this.order = this.$route.query.order;
		this.getProductList();
	}
});