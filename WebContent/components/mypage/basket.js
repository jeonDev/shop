const basketComponent = Vue.component('basket-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>장바구니</h2>
			</div>
			<div class="mb-4">
				<div class="mb-3">
					<!-- 전체 삭제 등.. -->
					<div class="d-flex justify-content-end">
						<span class="p-2">
							<button type="button" class="btn btn-secondary"
								@click="basketDelete('out')">품절품목삭제</button>
						</span>
						<span class="p-2">
							<button type="button" class="btn btn-secondary"
								@click="basketDelete('all')">선택삭제</button>
						</span>
					</div>
				</div>
				<div>
					<table class="table table-bordered not-table-hover">
						<colgroup>
							<col width="10px">
							<col width="65%">
							<col width="8%">
							<col width="8%">
							<col width="14%">
						</colgroup>
						<thead>
							<tr class="text-center">
								<th>
									<input type="checkbox" id="basket-no" class="label-checkbox"
										@click="allCheck">
								</th>
								<th>상품정보</th>
								<th>가격</th>
								<th>수량</th>
								<th>주문관리</th>
							</tr>
						</thead>
						<tbody v-if="basketList.length > 0">
							<tr v-for="(item, idx) in basketList" data-basket="item.BASKET_NO" >
								<td class="text-center align-middle">
									<input type="checkbox" :id="item.BASKET_NO" class="label-checkbox" v-model="item.CHK_YN">
								</td>
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
													<span> / {{ item.STOCK_CHK_NM }}</span>
													<span v-if="item.PRICE_DISCOUNT > 0"> / {{ item.PRICE_DISCOUNT }}% 할인 중.</span>
												</div>
											</router-link>
										</div>
									</div>
								</td>
								<td class="text-center align-middle">
									<span>{{ item.FINAL_PRICE.toLocaleString('ko-KR') }}</span>
									<span class="text-secondary" style="font-size:10px" v-if="item.PRICE_DISCOUNT > 0">
										<del>{{ item.TOT_PRICE.toLocaleString('ko-KR') }}</del>
									</span>
								</td>
								<td class="align-middle">
									<div class="d-flex justify-content-between">
										<i class="bi bi-dash-square item-hover-2" @click="productCntChange(item.BASKET_NO, -1)"></i>
										{{ item.PRODUCT_CNT.toLocaleString('ko-KR') }}
										<i class="bi bi-plus-square item-hover-2" @click="productCntChange(item.BASKET_NO, 1)"></i>
									</div>
								</td>
								<td class="text-center align-middle">
									<button type="button" class="btn btn-light"
										@click="basketDelete('one', item.BASKET_NO)">장바구니 제거</button>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<td colspan="5" class="text-center">
								<h2>장바구니에 담아둔 상품이 없습니다.</h2>
							</td>
						</tbody>
					</table>
				</div>
			</div>
			
			<div class="mb-4">
				<div>
					<ul class="text-secondary" style="font-size: 12px;">
						<li>SHOP은 전 상품 무료 배송입니다.</li>
						<li>결제 시 각종 할인 적용이 달라질 수 있습니다.</li>
						<li>장바구니 상품은 담은 시점과 현재의 판매 가격이 달라질 수 있습니다.</li>
					</ul>
				</div>
			</div>
			
			<!-- 결제금액정보 -->
			<tot-price :priceInfo="basketList"/>
			
			<div class="d-flex justify-content-center">
				<button type="button" class="btn btn-dark"
					@click="buyProduct">구매하기</button>
			</div>
		</div>
	`,
	data() {
		return {
			basketList : []		// 장바구니 리스트
		}
	},
	methods : {
		// 장바구니 조회
		getBasketList(){
			httpRequest({
				url: "user/product/basket",
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				this.basketList = rs.data.basketList;
			})
			.catch((error) => {
				console.log(error);
				alert(error.data.message);
				
				if(error.status == "401"){
					this.$router.push({name: "login-form"});
				}
			});
		},
		// 체크박스 전체 선택 및 해제
		allCheck(e){
			let chkYn = e.currentTarget.checked;
			
			$.each(this.basketList, function(idx, item){
				
				if(item.STOCK_CHK != 0){
					item.CHK_YN = chkYn;
				}
				
			});
		},
		// 상품 구매갯수 변경
		productCntChange(value, cnt){
			let obj = this.basketList;
			
			let findItem = obj.find(function(item){
				return item.BASKET_NO === value;
			});
			
			let idx = obj.indexOf(findItem);
			let productCnt = obj[idx].PRODUCT_CNT;
			
			if(productCnt == 1 && cnt == -1){
				return false;
			}
			
			obj[idx].PRODUCT_CNT = productCnt + cnt;
			
			
			let data = {"basket_no" : value,
					"product_cnt" : obj[idx].PRODUCT_CNT};
			
			httpRequest({
				url: "user/product/basket/update",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.msg);
				if(rs.data.code == "0000"){
					this.$router.go();
				}
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		// 장바구니 제거
		basketDelete(division, basketNo){
			let data = [];
			let msg = division == "one" ? "해당 상품을 장바구니에서 제거하시겠습니까?" :
						(division == "all" ? "선택된 상품들을 장바구니에서 제거하시겠습니까?"
								: "품절 및 판매 중지된 상품을 장바구니에서 제거하시겠습니까?"); 
			
			if(!confirm(msg)){
				return false;
			}
			
			// 한 건 제거
			if(division == 'one'){
				data.push(basketNo);
			// 선택 제거
			} else if(division == 'all'){
				$.each(this.basketList, function(idx, item){
					
					if(item.CHK_YN == true){
						data.push(item.BASKET_NO);
					}
					
				});
			// 품절 및 판매중지 상품 제거
			} else if(division == 'out'){
				$.each(this.basketList, function(idx, item){
					
					if(item.STOCK_CHK == 0){
						data.push(item.BASKET_NO);
					}
					
				});
			}
			
			httpRequest({
				url: "user/product/basket/delete",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.msg);
				if(rs.data.code == "0000"){
					this.$router.go();
				}
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		// 상품 구매
		buyProduct(){
			let buyCnt = 0;
			let data = [];
			let chkData = [];
			$.each(this.basketList, function(idx, item){
				if(item.CHK_YN) {
					buyCnt++;
					chkData.push({"product_no" : item.PRODUCT_NO
							, "product_cnt" : item.PRODUCT_CNT});
					data.push({"basket_no" : item.BASKET_NO});
				}
			});
			
			// 선택된 상품이 있는지 체크
			if(buyCnt < 1){
				alert("선택된 상품이 없습니다.");
				return false;
			} else{
				if(confirm(buyCnt + "건의 상품을 구매하시겠습니까?")){
					
					httpRequest({
						url: "product/stock/check",
						method: "POST",
						responseType: "json",
						data: chkData
					})
					.then((rs) => {
						this.$router.push({name: "pay-list-form", params:{payInfo: "basket"}, query: {productPayInfo: JSON.stringify(data)} });
					})
					.catch((error) => {
						alert(error.data.message);
					});
					
				}
			}
		},
		imgSrc(src){
			return server + src;
		}
	},
	created() {
		this.getBasketList();
	}
});