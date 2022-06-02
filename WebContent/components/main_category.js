Vue.component('main-category', {
	template: `
		<div>
			<div class="d-flex">
				<div class="p-2">
					<h4>카테고리</h4>
				</div>
				<div class="ml-auto p-2">
					<span>
						<router-link :to="{ path: '/shop/product/list' }" class="a">전체보기</router-link>
					</span>
				</div>
			</div>
			<hr class="mt-0">
			<div>
				<div class="row w-100">
					<div class="col-md-3 border item-hover-1" v-for="(item, index) in categoryList" v-if="item.UP_CD == null">
						<router-link :to="{ path: '/shop/product/list', query: { productType: item.TYPE_CD }}" class="a p-3">
							<div class="text-cut a text-center">
								{{ item.TYPE_NM }}
							</div>
						</router-link>
					</div>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			categoryList : []
		}
	},
	methods : {
		getCategoryList(){
			
			httpRequest({
				url: "product/category/list",
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				this.categoryList = rs.data.categoryList;
			})
			.catch((error) => {
				console.log(error);
			});
		}
		
		
	},
	created() {
		this.getCategoryList();
	}
});