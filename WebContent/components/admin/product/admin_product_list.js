const adminProductComponent = Vue.component('admin-product-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>상품관리</h2>
			</div>
			<div id="admin-product-list">
				
				<!-- 등록버튼  및 조회조건-->
				<div class="d-flex justify-content-end mb-3">
					<div class="p-2">
						<select-box :obj="obj" @input="changeCategory"/>
					</div>
					<div class="p-2">
						<select-box :obj="productStateObj" @input="changeProductState"/>
					</div>
					<div class="p-2">
						<button class="btn btn-dark"
							@click="excelDownload">Excel Download</button>
					</div>
					<div class="p-2">
						<button class="btn btn-dark"
							@click="productManage('create')">상품등록</button>
					</div>
				</div>
				<!-- 정렬 순서 -->
				<div>
					<!-- order -->
					<div class="container d-flex justify-content-end mb-3" style="font-size:12px;">
						<div :class="[order == '' ? 'text-danger' : 'text-secondary']" class="p-2 a" @click="orderChange('')">최신순</div>
						<div :class="[order == 'product_view' ? 'text-danger' : 'text-secondary']" class="p-2 a" @click="orderChange('product_view')">조회순</div>
						<div :class="[order == 'sales_rate' ? 'text-danger' : 'text-secondary']" class="p-2 a" @click="orderChange('sales_rate')">판매순</div>
					</div>
				</div>
				<div>
					<table class="table table-bordered not-table-hover">
						<colgroup>
							<col width="50%">
							<col width="10%">
							<col width="10%">
							<col width="7%">
							<col width="7%">
							<col width="16%">
						</colgroup>
						<thead>
							<tr class="text-center">
								<th>상품정보</th>
								<th>등록일</th>
								<th>가격</th>
								<th>조회수</th>
								<th>판매량</th>
								<th>상품관리</th>
							</tr>
						</thead>
						
						<tbody v-if="productList.length > 0">
							<tr v-for="(item, idx) in productList">
								<td class="align-middle">
									<div class="d-flex">
										<div class="pr-3">
											<router-link :to="{name: 'product-detail-form', params: { productId : item.PRODUCT_ID } }" class="a">
												<img :src="imgSrc(item.IMG_SRC)" class="border" onerror="this.src='/shop/images/img_error.png'" style="width: 75px; height: 75px"/>
											</router-link>
										</div>
										<div>
											<router-link :to="{name: 'product-detail-form', params: { productId : item.PRODUCT_ID } }" class="a">
												<div>
													{{ item.PRODUCT_NAME }}
												</div>
												<div class="text-secondary" style="font-size:12px;">
													<span>옵션 : </span>
													<span>{{ item.PRODUCT_SIZE }}</span>
													<span> / {{ item.PRODUCT_CNT }}개 남음</span>
													<span v-if="item.PRICE_DISCOUNT"> / {{ item.PRICE_DISCOUNT }}% 할인 중.</span>
												</div>
											</router-link>
										</div>
									</div>
								</td>
								<td class="text-center align-middle">
									{{ dateFormat(item.REP_DTTM) }}
								</td>
								<td class="text-center align-middle">
									<div>
										<span>{{ item.FINAL_PRICE.toLocaleString('ko-KR') }}원</span>
										<span class="text-secondary" style="font-size:12px" v-if="item.PRICE_DISCOUNT != 0 ">
											<del>{{ item.PRICE.toLocaleString('ko-KR') }}원</del>
										</span>
									</div>
								</td>
								<td class="text-center align-middle">
									{{ item.PRODUCT_VIEW.toLocaleString('ko-KR') }}
								</td>
								<td class="text-center align-middle">
									{{ item.SALES_RATE.toLocaleString('ko-KR') }}
								</td>
								<td class="text-center align-middle">
									<div class="p-1">
										<button type="button" class="btn btn-light"
											@click="productManage(item.PRODUCT_ID)">상품 정보 수정</button>
									</div>
									<div class="p-1">
										<button type="button" class="btn btn-light"
											@click="sizeManage(item.PRODUCT_ID)">사이즈 관리</button>
									</div>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="6" class="text-center">
									<h2>조회된 상품이 없습니다.</h2>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			
			<!-- Pagenation -->
			<pagenation-form :obj="page" @pageMove="pageMove"></pagenation-form>
		</div>
	`,
	watch: {
		$route() {
			this.productType = this.$route.query.productType;
			this.productState = this.$route.query.productState;
			this.productOrder = this.$route.query.productOrder;
			this.page.curPage = this.$route.query.curPage;
			this.order = this.$route.query.order;
			this.getProductList();
		}
	},
	data(){
		return{
			productList: [],
			excelProductList : [],
			productType: "",
			productState: "",
			productOrder: "",
			order : "",
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			},
			obj : {
				id : "product-type",
				name : "product_type",
				class : "form-control",
				allView : true,
				allViewNm : "카테고리 선택",
				selected: "",
				options : []
			},
			productStateObj : {
				id : "product-state",
				name : "product_state",
				class : "form-control",
				allView : true,
				allViewNm : "판매상태 선택",
				selected: "",
				options : []
			}
		}
	},
	methods : {
		// PRODUCT_STATE
		getProductStateMenuList(){
			let data = {"cmn_type" : "PRODUCT_STATE"};
			
			httpRequest({
				url: "get/code/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.productStateObj.options = rs.data;
				this.productStateObj.selected = this.prdocutState;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 카테고리 리스트 조회
		getCategoryList(){
			
			httpRequest({
				url: "product/category/list",
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				let data = rs.data.categoryList;
				let array = [];
				$.each(data, function(idx, item){
					if(item.TYPE_CD) {
						array.push({
							"CMN_CD" : item.TYPE_CD,
							"CMN_NM" : item.TYPE_NM
						});
					}
				});
				this.obj.options = array;
				this.obj.selected = this.productType;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 상품 조회
		getProductList(){
			
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			let blockUnit = this.page.blockUnit;
			let productType = this.productType;
			let productState = this.productState;
			let order = this.order;
			
			let data = {curPage: curPage,
					pageUnit: pageUnit,
					blockUnit: blockUnit,
					admin: 'Y'};
			
			if(productType != '')
				data.productType = productType;
			if(productState != '')
				data.productState = productState;
			if(order != '')
				data.order = order;
			
			httpRequest({
				url: "product/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				console.log(rs);
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
			
			moveAnimate("admin-product-list");
		},
		changeCategory(typeCd){
			if(typeCd == this.productType) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.productType = typeCd;
			query.curPage = 1;
			this.$router.push({ query });
		},
		changeProductState(typeCd){
			if(typeCd == this.productState) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.productState = typeCd;
			query.curPage = 1;
			this.$router.push({ query });
		},
		orderChange(order){
			if(order == this.order) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.order = order;
			this.$router.push({ query });
		},
		imgSrc(src){
			return server + src;
		},
		dateFormat(value){
			return dateFormat(value);
		},
		// 사이즈 관리
		sizeManage(productId) {
			this.$router.push({name: "admin-product-size-form", params:{productId: productId}});
		},
		// 상품 관리
		productManage(productId) {
			this.$router.push({name: "admin-product-manage-form", params:{productId: productId}});
		},
		excelDownload(){
			let data = {};
			let header = ["상품명", "상품사이즈", "등록일", "가격", "조회수", "판매량"];
			let body = [];
			
			$.each(this.productList, function(idx, item){
				body.push({
					"product_name" : item.PRODUCT_NAME,
					"product_size" : item.PRODUCT_SIZE,
					"rep_dttm" : item.REP_DTTM,
					"final_price" : item.FINAL_PRICE,
					"product_view" : item.PRODUCT_VIEW,
					"sales_rate" : item.SALES_RATE
				});
			})
			
			data.header = header;
			data.body = body;
			data.filename = "상품 리스트 정보";
			
			excelDownloads(data);
		}
	},
	created() {
		this.productState = this.$route.query.productState;
		this.productType = this.$route.query.productType;
		this.productOrder = this.$route.query.productOrder;
		this.page.curPage = this.$route.query.curPage;
		this.order = this.$route.query.order;
		
		this.getCategoryList();
		this.getProductStateMenuList();
		this.getProductList();
	}
});
