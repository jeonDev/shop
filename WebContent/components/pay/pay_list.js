const payListComponent = Vue.component('pay-list-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>결제 정보</h2>
			</div>
			
			<!-- 상품 정보 -->
			<div class="mb-4">
				<div>
					<table class="table table-bordered not-table-hover">
						<colgroup>
							<col width="60%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
							<col width="8%">
						</colgroup>
						<thead>
							<tr class="text-center">
								<th>상품 정보</th>
								<th>가격</th>
								<th>수량</th>
								<th>할인</th>
								<th>배송비</th>
								<th>총 금액</th>
							</tr>
						</thead>
						<tbody v-if="productPayList.length > 0">
							<tr v-for="(item, idx) in productPayList">
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
													<span v-if="item.DISCOUNT_YN == 'Y'"> / {{ item.PRICE_DISCOUNT }}% 할인 중.</span>
												</div>
											</router-link>
										</div>
									</div>
								</td>
								<td class="text-center align-middle">{{ Number(item.TOT_PRICE).toLocaleString('ko-KR') }}</td>
								<td class="text-center align-middle">{{ Number(item.PRODUCT_CNT).toLocaleString('ko-KR') }}</td>
								<td class="text-center align-middle">
									<span v-if="item.DISCOUNT_YN == 'Y'">{{ Number(item.PRICE_DISCOUNT).toLocaleString('ko-KR') }}%</span>
									<span v-else>-</span>
								</td>
								<td class="text-center align-middle">배송비 무료</td>
								<td class="text-center align-middle">
									<span>{{ Number(item.FINAL_PRICE).toLocaleString('ko-KR') }}</span>
									<span class="text-secondary" style="font-size:10px" v-if="item.PRICE_DISCOUNT > 0"><del>{{ Number(item.TOT_PRICE).toLocaleString('ko-KR') }}</del></span>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<td colspan="5" class="text-center">
								<h2>결제 상품 내역이 없습니다.</h2>
							</td>
						</tbody>
					</table>
				</div>
			</div>
			
			<div class="mb-4">
				<div>
					<ul class="text-secondary" style="font-size: 12px;">
						<li>SHOP은 전 상품 무료 배송입니다.</li>
						<li>2개 이상의 브랜드를 주문하신 경우, 개별 배송됩니다.</li>
						<li>배송지 정보는 반드시 입력해주셔야 합니다.</li>
					</ul>
				</div>
			</div>
			
			<!-- 배송지 정보 -->
			<div class="mb-4">
				<div class="mb-5">
					<h2>배송지 정보 입력</h2>
				</div>
				<div class="border">
					<div class="p-3">
						<span class="p-2">
							<input type="radio" id="userAddrChk" class="label-checkbox align-middle" name="addrInfo" v-model="addrInfoChk" value="userAddr"
								:disabled="!userAddrInfo.NAME"
								@click="changeAddrInfo"/>  
								<label for="userAddrChk" style="cursor:pointer">  {{ userAddrInfo.NAME != null ? userAddrInfo.NAME : '사용자' }} 님의 배송지</label>
						</span>
						<span class="p-2">
							<input type="radio" id="newAddrChk" class="label-checkbox align-middle" name="addrInfo" v-model="addrInfoChk" value="newAddr"
								@click="changeAddrInfo"/>
								<label for="newAddrChk" style="cursor:pointer">  신규 배송지</label>
						</span>
					</div>
					<hr>
					<div class="row mb-3">
						<div class="col-sm-2">
							수령인
						</div>
						<div class="col-sm-10">
							<input type="text" class="form-control" v-model="addrInfo.NAME" maxlength="10"/>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-sm-2">
							전화번호
						</div>
						<div class="col-sm-10">
							<input type="text" class="form-control" v-model="addrInfo.TEL" maxlength="11"/>
						</div>
					</div>

					<div class="row mb-3" v-if="addrInfoChk == 'userAddr'">
						<div class="col-sm-2">
							주소
						</div>
						<div class="col-sm-10" v-show="addrInfoChk == 'userAddr'">
							<input type="text" class="form-control" v-model="addrInfo.ADDR" readonly/>
						</div>
					</div>
					<div v-else>
						<address-form
							@zipCd="value => addrInfo.ZIP_CD = value"
							@address="value => addrInfo.ADDRESS = value"
							@address2="value => addrInfo.ADDRESS2 = value"/>
					</div>
					
					<div class="row mb-3">
						<div class="col-sm-2">
							배송지 메모
						</div>
						<div class="col-sm-10">
							<textarea rows="5" class="form-control" v-model="addrInfo.MEMO"></textarea>
						</div>
					</div>
				</div>
			</div>
			
			<!-- 결제금액정보 -->
			<tot-price :priceInfo="productPayList"/>
			
			<!-- 결제 버튼 -->
			<div class="d-flex justify-content-center">
				<button type="button" class="btn btn-dark"
					@click="payProduct">결제하기</button>
			</div>
		</div>
	`,
	data() {
		return {
			productPayInfo : [],		// 결제 상품 내역(파라미터)
			productPayList : [],		// 결제 상품 내역(상세 내역)
			userAddrInfo : {},			// 배송지 정보(사용자)
			newAddrInfo : {				// 배송지 정보(신규)
				ADDR: "",
				ADDRESS1: "",
				ADDRESS2: "",
				NAME: "",
				TEL: "",
				MEMO: ""
			},
			paymentInfo: {},			// import 결제 정보
			addrInfo : {},				// 배송지 정보
			addrInfoChk : "",			// 배송지 정보(Radio박스)
			payInfo : ""				// 구분(장바구니 / 상품구매)
		}
	},
	methods: {
		// 결제정보 조회
		getPayInfo(){
			let data = this.productPayInfo;
			let payInfo = this.payInfo;
			
			httpRequest({
				url: "pay/info/" + payInfo + "/list",
				method: "GET", 
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.productPayList = rs.data.productPayList;
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		// 사용자 주소정보 조회
		getUserShoppingAddrInfo(){
			
			httpRequest({
				url: "user/get/info",
				method: "GET", 
				responseType: "json"
			})
			.then((rs) => {
				this.userAddrInfo = rs.data.userInfo;
				this.addrInfo = Object.assign({}, this.userAddrInfo);
				this.addrInfoChk = "userAddr";
			})
			.catch((error) => {
				if(error.status == "401"){
					this.addrInfo = Object.assign({}, this.newAddrInfo);
					this.addrInfoChk = "newAddr";
				}
			});
		},
		// 주소정보 변경(신규 / 기존)
		changeAddrInfo(e){
			let addrInfo = e.currentTarget.value;
			
			if(addrInfo == "userAddr") {
				this.addrInfo = Object.assign({}, this.userAddrInfo);
			} else if(addrInfo == "newAddr") {
				this.addrInfo = Object.assign({}, this.newAddrInfo ) ;
			}
		},
		// 배송지 정보 입력 체크
		addrInfoFormChk(){
			if(!this.addrInfo.ADDR || (!this.addrInfo.ADDRESS1 && this.addrInfo.ADDRESS2) ) {
				alert("배송지 정보(주소)를 입력해주세요.");
				return false;
			} else if(this.addrInfo.NAME) {
				alert("배송지 정보(수령인)를 입력해주세요.");
				return false;
			} else if(this.addrInfo.TEL) {
				alert("배송지 정보(전화번호)를 입력해주세요.");
				return false;
			}
			return true;
		},
		// 상품 결제
		payProduct(){
			// 필수 입력 체크
			if(!this.addrInfoFormChk) return false;
			
			if(this.productPayList.length < 1) {
				return false;
			}
			
			let productPayList = [];
			
			$.each(this.productPayList, function(idx, item){
				productPayList.push({"product_no" : item.PRODUCT_NO
									, "product_cnt" : item.PRODUCT_CNT});
			});
			
			let data = {
					"addrInfo" : this.addrInfo,
					"productPayList" : productPayList
					};
			
			if(!confirm("결제하시겠습니까?")) return false;
			
			httpRequest({
				url: "user/payment",
				method: "POST", 
				responseType: "json",
				data: data
			})
			.then((rs) => {
				let productPayInfo = [];
				
				$.each(this.productPayList, function(idx, item){
					productPayInfo.push({"product_no" : item.PRODUCT_NO,
										"product_cnt" : item.PRODUCT_CNT});
				});
				
				let data = {"order_no" : rs.data.orderInfo.order_no
							 , "buyInfo" : productPayInfo};
				
				// basket...
				let basketNos = [];
				$.each(this.productPayInfo, function(idx, item){
					if(item.basket_no){
						basketNos.push(item.basket_no);
					} else {
						return false;
					}
				});
				
				if(basketNos.length > 0){
					data.basket_no = basketNos;
				}
				
				// import 결제 진행.
				// 실제 결제 시, Test 제거
				paymentImport(rs.data.orderInfo, data);
				
			})
			.catch((error) => {
				alert(error.data.message);
			});
			
		},
		imgSrc(src){
			return server + src;
		}
	},
	created() {
		this.productPayInfo = JSON.parse(this.$route.query.productPayInfo);
		this.payInfo = this.$route.params.payInfo;
		this.getPayInfo();
		this.getUserShoppingAddrInfo();
	}
});
/*
 * productPayInfo
 * -> productNo / productCnt
 * basketPayInfo
 * -> basketNo
 * */
