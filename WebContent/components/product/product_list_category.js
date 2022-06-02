Vue.component('product-list-category-form', {
	props: ["productType"],
	template: `
		<div>
			<div class="container mt-5 bg-light"> 
				<span v-for="(item, idx) in categoryList" :class="{ 'font-weight-bold' : item.LVL == 0 }">
					<hr v-if="item.LVL == 0"/>
					<a href="javascript:void(0)" :class="{ 'text-danger h5' : item.TYPE_CD == productType }" class="a p-3"
					@click="changeCategory(item.TYPE_CD)">
						{{ item.TYPE_NM }}
					</a>
					
					<!--
					<router-link :to="{path: '/shop/product/list', query: { productType: item.TYPE_CD }}" :class="{ 'text-danger h5' : item.TYPE_CD == productType }" class="a p-3" :style="">
						{{ item.TYPE_NM }}
					</router-link>
					-->
				</span>
				<hr/>
			</div>
		</div>
	`,
	data(){
		return{
			categoryList : []
		}
	},
	methods : {
		// 카테고리 리스트 조회
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
		},
		changeCategory(typeCd){
			if(typeCd == this.productType) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.productType = typeCd;
			query.curPage = 1;
			this.$router.push({ query });
		}
	},
	created() {
		this.getCategoryList();
	}
});