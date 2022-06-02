const adminProductSizeComponent = Vue.component('admin-product-size-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>상품 사이즈 관리</h2>
			</div>
			<div id="admin-product-size-list">
				
				<!-- 등록버튼  및 조회조건-->
				<div class="d-flex justify-content-end mb-3">
					
					<div class="p-2">
						<input type="text" id="product-cnt" class="form-control" v-model="productCnt" placeholder="재고량 입력"/>
					</div>
					
					<div class="p-2">
						<button class="btn btn-dark"
							@click="updateAllProductCnt">재고량 일괄조정</button>
					</div>
					
					<div class="p-2">
						<input type="text" id="price-discount" class="form-control" v-model="priceDiscount" placeholder="할인율 입력(0~100)"/>
					</div>
					
					<div class="p-2">
						<button class="btn btn-dark"
							@click="updateAllPriceDiscount">할인율 일괄조정</button>
					</div>
					
					<div class="p-2">
						<button class="btn btn-dark"
							@click="createProductSize">사이즈 추가</button>
					</div>
					
					<div class="p-2">
						<button class="btn btn-dark"
							@click="createAllSave">저장</button>
					</div>
				</div>
				
				<div>
					<table class="table table-bordered not-table-hover">
						<colgroup>
							<col width="8%">
							<col width="12%">
							<col width="12%">
							<col width="20%">
							<col width="20%">
							<col width="7%">
							<col width="7%">
							<col width="13%">
						</colgroup>
						<thead>
							<tr class="text-center">
								<th>상품</th>
								<th>등록일</th>
								<th>사이즈</th>
								<th>판매금액(할인율)</th>
								<th>판매된가격</th>
								<th>판매량</th>
								<th>재고</th>
								<th>관리</th>
							</tr>
						</thead>
						<tbody v-if="productList.length > 0">
							<tr v-for="(item, idx) in productList" :id="'size-' + idx" :data-product-no="item.PRODUCT_NO"
									:class="item.DEL_YN == 'Y' ? 'bg-light' : ''">
								<td class="align-middle">
									<div class="d-flex">
										<div class="pr-3" v-if="item.IMG_SRC">
											<router-link :to="{name: 'product-detail-form', params: { productId : item.PRODUCT_ID } }" class="a">
												<img :src="imgSrc(item.IMG_SRC)" class="border" onerror="this.src='/shop/images/img_error.png'" style="width: 75px; height: 75px"/>
											</router-link>
										</div>
									</div>
								</td>
								<td class="text-center align-middle">
									<span v-if="item.REP_DTTM">{{ dateFormat(item.REP_DTTM) }}</span>
								</td>
								<td class="text-center align-middle">
									<span v-if="item.PRODUCT_SIZE">{{item.PRODUCT_SIZE}}</span>
									<span v-else>
										<input type="text" class="form-control" :id="'product_size' + idx"/>
									</span>
								</td>
								<td class="text-center align-middle">
									<span v-if="item.PRICE_DISCOUNT >= 0">
										<div>
											{{ Number(item.TOT_PRICE).toLocaleString('ko-KR') }}
										</div>
										<div>
											({{ item.PRICE_DISCOUNT }}%)
										</div>
									</span>
									<span v-else>
										<input type="text" class="form-control" :id="'price_discount' + idx"/>
									</span>
								</td>
								<td class="text-center align-middle">
									<span v-if="item.BUY_PRICE >= 0">{{ item.BUY_PRICE.toLocaleString('ko-KR') }}</span>
								</td>
								<td class="text-center align-middle">
									<span v-if="item.SALES_RATE >= 0">{{ Number(item.SALES_RATE).toLocaleString('ko-KR') }}</span>
								</td>
								<td class="text-center align-middle">
									<span v-if="item.PRODUCT_CNT >= 0">{{ Number(item.PRODUCT_CNT).toLocaleString('ko-KR') }}</span>
									<span v-else>
										<input type="text" class="form-control" :id="'product_cnt' + idx"/>
									</span>
								</td>
								<td class="text-center align-middle">
									<div class="p-2" v-if="item.PRODUCT_NO">
										<span v-if="item.DEL_YN == 'N'">
											<div class="p-1">
												<button class="btn btn-dark" :data-idx="idx"
													@click="updateProductSize">수정</button>
											</div>
											<div class="p-1">
												<button class="btn btn-dark" :data-idx="idx"
													@click="deleteProductSize">삭제</button>
											</div>
										</span>
										<span v-else>
											<div class="p-1">
												<button class="btn btn-dark" :data-idx="idx"
													@click="reInsertProductSize">추가</button>
											</div>
											<div style="font-size:12px; color:red;">
												<삭제된 상품>
											</div>
										</span>
									</div>
									<div class="p-2" v-else>
										<button class="btn btn-dark" :data-idx="idx"
											@click="saveProductSize">저장</button>
									</div>
								</td>
							</tr>
						</tbody>
						
						<tbody v-else>
							<tr>
								<td colspan="8" class="text-center">
									<h2>조회된 상품이 없습니다.</h2>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			
			<admin-product-change-form :productInfo="changeProductInfo"
				@updateProductSize="updateProductList"/>
			
		</div>
	`,
	data(){
		return{
			productList: [],
			productId: "",
			priceDiscount : "",
			productCnt : "",
			changeProductInfo : {}
		}
	},
	methods : {
		// 상품 조회
		getProductList(){
			
			let productId = this.productId;
			
			let data = {"product_id" : productId};
			
			httpRequest({
				url: "admin/product/size/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.productList = rs.data.productList;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		imgSrc(src){
			return server + src;
		},
		dateFormat(value){
			return dateFormat(value);
		},
		// 사이즈 제거
		deleteProductSize(e) {
			let idx = e.currentTarget.dataset.idx;
			let productNo = $('#size-' + idx).data().productNo;
			
			let data = {
					"product_no" : productNo,
					"del_yn" : "Y"
			};
			
			if(!confirm("해당 사이즈의 상품을 삭제하시겠습니까?")) return false;
			
			this.updateProductList(data);
		},
		// 삭제된 상품 재 추가
		reInsertProductSize(e){
			let idx = e.currentTarget.dataset.idx;
			let productNo = $('#size-' + idx).data().productNo;
			
			let data = {
					"product_no" : productNo,
					"del_yn" : "N"
			};
			
			if(!confirm("해당 사이즈의 상품을 다시 추가하시겠습니까?")) return false;
			
			this.updateProductList(data);
		},
		updateProductSize(e){
			let idx = e.currentTarget.dataset.idx;
			let productNo = $('#size-' + idx).data().productNo;
			let product = this.productList[idx];
			
			let data = {
					"product_no"	 : productNo,
					"price_discount" : product.PRICE_DISCOUNT,
					"product_cnt"	 : product.PRODUCT_CNT,
					"product_size"	 : product.PRODUCT_SIZE
			};
			
			this.changeProductInfo = data;
			
			$('#product-size-change').removeClass('display-none');
		},
		// 재고량 일괄 조정
		updateAllProductCnt(){
			let productCnt = this.productCnt;
			let productId = this.productId;
			
			if(isNaN(productCnt)){
				alert("재고량을 입력해주세요.");
				$('#product-cnt').focus();
				return false;
			}
			
			if(!confirm("재고량을 수정하시겠습니까?")) return false;
			
			let data = {
					"product_cnt" : productCnt,
					"product_id" : productId
			};
			
			this.updateProductList(data);
			this.productCnt = "";
		},
		// 할인율 일괄 조정
		updateAllPriceDiscount(){
			let priceDiscount = this.priceDiscount;
			let productId = this.productId;
			
			if(isNaN(priceDiscount) 
					|| priceDiscount < 0 || priceDiscount > 100){
				alert("할인율은 백분율(0~100)로 입력해주세요.")
				$('#price-discount').focus();
				return false;
			}
			
			if(!confirm("할인율을 수정하시겠습니까?")) return false;
			
			let data = {
					"price_discount" : priceDiscount,
					"product_id" : productId
			};
			
			this.updateProductList(data);
			this.priceDiscount = "";
		},
		// 사이즈 추가
		createProductSize() {
			this.productList.unshift({
				'PRODUCT_NO' : ""
			});
		},
		// 저장
		saveProductSize(e) {
			let idx = e.currentTarget.dataset.idx;
			
			let data = [];
			
			if(!this.insertFormChk(idx, data)) return false;
			
			if(!confirm("사이즈를 추가하시겠습니까?")) return false;
			
			this.insertProductList(data);
		},
		createAllSave(){
			let dataList = this.productList;
			
			let data = [];
			
			for(let idx = 0; idx < dataList.length; idx++){
				
				let item = dataList[idx];
				
				if(item.PRODUCT_NO == ""){
					this.insertFormChk(idx, data);
				}
			};
			
			if(data.length < 1) {
				alert("등록할 정보가 없습니다.");
				return false;
			}
			
			if(!confirm("사이즈를 추가하시겠습니까?")) return false;
			
			this.insertProductList(data);
		},
		insertFormChk(idx, datas){
			let productSize 	= $('#product_size' + idx).val();
			let priceDiscount 	= Number($('#price_discount' + idx).val());
			let productCnt 		= Number($('#product_cnt' + idx).val());
			
			if(!productSize) {
				alert("상품 사이즈를 입력해주세요.")
				return false;
			} else if(isNaN(priceDiscount) ||
					!(priceDiscount >= 0 && priceDiscount <= 100)) {
				alert("할인율은 백분율(0~100)로 입력해주세요.")
				return false;
			} else if(!productCnt || isNaN(productCnt)) {
				alert("상품 갯수를 입력해주세요.");
				return false;
			}
			
			let data = {
					"product_size" : productSize,
					"price_discount" : priceDiscount,
					"product_cnt" : productCnt,
					"product_id" : this.productId
				};
			
			datas.push(data);
			
			return true;
		},
		insertProductList(data){
			httpRequest({
				url: "admin/product/list/create",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.message);
				this.getProductList();
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		updateProductList(data){
			httpRequest({
				url: "admin/product/list/update",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.message);
				this.getProductList();
			})
			.catch((error) => {
				console.log(error);
			});
		}
	},
	created() {
		this.productId = this.$route.params.productId;
		this.getProductList();
	}
});

/*
1. PRODUCT_SIZE select box 추가! X
	└ 생각해보니 select 박스는 추가하면 사이즈 추가할 떄 입력을 못함; 물론 수정도..,
2. DEL_YN 삭제버튼 추가!
	:TODO 삭제된 사이즈 상품 구분짓기 + 다시 추가하기 기능
	
3. 사이즈 추가 버튼
	--> 추가를 누르고 값을 입력하면 v-if가 true가 되가지고,,,, ㅠㅠ
	어떻게 할지 더 고민좀,,,
	
	방향은 :::::::: 
					① 사이즈 추가 버튼 클릭
					② 사이즈 / 할인율 / 재고 입력
					③ 저장버튼 클릭
						-> data-idx 받아서 this.productList[idx] 이런식으로 하려 함.
	문제!!!
		-> v-if를 쓰니.. 할인율이 0이면 안되는듯?
					
 * */
