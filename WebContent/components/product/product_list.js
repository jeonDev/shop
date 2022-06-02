const productListComponent = Vue.component('product-list-form', {
	template: `
		<div>
			<!-- Category -->
			<div class="mb-5">
				<product-list-category-form :productType="productType"/>
			</div>
			
			<!-- Product List -->
			<div class="container">
			<!-- justify-content-center : 4건 시, 밑에 중앙정렬..-->
				<div id="product-list" class="list-group list-group-horizontal justify-content-center" style="flex-wrap:wrap">
					<div v-for="(item, idx) in productList" class="list-group-item w-30 m-2">
						<router-link :to="{name: 'product-detail-form', params: { productId : item.PRODUCT_ID } }" class="a">
							<div>
								<img :src="imgSrc(item.IMG_SRC)" class="img-fluid p-1" style="width: 400px; height : 350px;" onerror="this.src='/shop/images/img_error.png'">
							</div>
							<div>
								{{ item.PRODUCT_NAME }}
							</div>
							<div>
								<span class="text-secondary" style="font-size:12px" v-if="item.PRICE_DISCOUNT != 0 ">
									<del>{{ item.PRICE.toLocaleString('ko-KR') }}원</del>
								</span>
								<span>{{ item.FINAL_PRICE.toLocaleString('ko-KR') }}원</span>
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
			this.getProductList();
		}
	},
	data(){
		return{
			productList: [],
			productType: "",
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 9,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			}
		}
	},
	methods : {
		getProductList(){
			let data = {curPage: this.page.curPage,
					pageUnit: this.page.pageUnit,
					blockUnit: this.page.blockUnit,
					productType: this.productType};
			
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
		imgSrc(src){
			return server + src;
		}
	},
	created() {
		this.productType = this.$route.query.productType;
		this.page.curPage = this.$route.query.curPage;
		this.getProductList();
	}
});