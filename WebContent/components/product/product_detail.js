const productComponent = Vue.component('product-detail-form', {
	template: `
		<div>
			<!-- 상품 정보 -->
			<div class="container">
				<div class="d-flex justify-content-between">
					<!-- 상품 이미지 -->
					<div class="w-50">
						<div id="repImages">
							<img id="repImg" :src="repImg" class="border" onerror="this.src='/shop/images/img_error.png'"/>
						</div>
						<div id="listImages">
							<img class="list-image border" :src="img" v-for="(img, idx) in imgList"
								:class="{ 'border-primary' : idx == 0 }"
								@click="changeImg($event)"
								onerror="this.src='/shop/images/img_error.png'"/>
						</div>
					</div>
										
					<!-- 구매정보 -->
					<div class="w-50">
						<div class="text-center mb-4">
							<h2>상품 정보</h2>
						</div>
						
						<!-- 상품명 -->
						<div class="row mb-2">
							<div class="col-sm-3 text-right font-weight-bold">
								상품명
							</div>
							<div class="col-sm-9">
								{{ productInfo.PRODUCT_NAME }}
							</div>
						</div>
						
						<!-- 카테고리 -->
						<div class="row mb-2">
							<div class="col-sm-3 text-right font-weight-bold">
								카테고리
							</div>
							<div class="col-sm-9">
								{{ productInfo.PRODUCT_TYPE_NM }}
							</div>
						</div>
						
						<!-- 상품 가격 -->
						<div class="row mb-2">
							<div class="col-sm-3 text-right font-weight-bold">
								가격
							</div>
							<div class="col-sm-9">
								<span>{{Number(productInfo.FINAL_PRICE).toLocaleString('ko-KR')}}₩</span>
								<span v-if="productInfo.TOP_PRICE_DISCOUNT"><del>{{ Number(productInfo.PRICE).toLocaleString('ko-KR') }}₩</del></span>
								<span class="text-danger font-weight-bold pl-2" v-if="productInfo.TOP_PRICE_DISCOUNT">{{ productInfo.TOP_PRICE_DISCOUNT }}% 할인 중</span>
							</div>
						</div>
						
						<!-- 상품 상태 -->
						<div class="row mb-2">
							<div class="col-sm-3 text-right font-weight-bold">
								상태
							</div>
							<div class="col-sm-9">
								{{ productInfo.PRODUCT_STATE_NM }}
							</div>
						</div>
						
						<!-- 상품 조회수 -->
						<div class="row mb-2">
							<div class="col-sm-3 text-right font-weight-bold">
								조회수
							</div>
							<div class="col-sm-9">
								{{ productInfo.PRODUCT_VIEW }} 
							</div>
						</div>
						
						<!-- 상품 판매량 -->
						<div class="row mb-2">
							<div class="col-sm-3 text-right font-weight-bold">
								판매량
							</div>
							<div class="col-sm-9">
								{{ productInfo.SALES_RATE }} 
							</div>
						</div>
						
						<!-- 상품 사이즈 선택 -->
						<div class="row mb-2">
							<div class="col-sm-3 text-right font-weight-bold">
								사이즈 선택
							</div>
							<div class="col-sm-9">
								<select-box :obj="obj" @input="addProduct"/>
							</div>
						</div>
						<hr>
						<!-- 상품 구매 정보 -->
						<div class="container bg-light mt-3 mb-2 pt-2 pb-2" v-if="productPayInfo.length > 0">
							<div>
								<h4>구매내역({{ productPayInfo.length }})</h4>
							</div>
							<div class="row mb-2" v-for="(item, idx) in productPayInfo">
							
								<!-- 상품명 및 사이즈 -->
								<div class="col-sm-5">
									{{ item.product_nm }} ({{ item.product_size }})
								</div>
								
								<!-- 상품 갯수 -->
								<div class="col-sm-3">
									<i class="bi bi-dash-square item-hover-2" @click="productCntChange(item.product_no, -1)"></i>
									{{ item.product_cnt }}
									<i class="bi bi-plus-square item-hover-2" @click="productCntChange(item.product_no, 1)"></i>
								</div>
								
								<!-- 상품 가격 -->
								<div class="col-sm-3 d-flex justify-content-between">
									<span>{{ item.finalPrice.toLocaleString('ko-KR') }}₩</span>
									<span class="text-secondary" style="font-size:10px" v-if="item.priceDiscount != 0">
										<del>({{ item.totPrice.toLocaleString('ko-KR') }}₩)</del>
									</span>
								</div>
								
								<!-- 삭제 -->
								<div class="col-sm-1 p-0">
									<button type="button" class="close" data-dismiss="modal" aria-label="Close" 
											@click="removeProduct(item.product_no)">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
							</div>
							
							<!-- 총 가격 -->
							<div class="text-right p-2 font-weight-bold">
								구매 금액 : {{buyFinalPrice.toLocaleString('ko-KR')}}원
							</div>
						</div>
						
						<div class="row mt-4">
							<div class="col-sm-6">
								<button type="button" class="btn btn-outline-dark w-100"
										@click="buyProduct">
									구매하기
								</button>
							</div>
							<div class="col-sm-6">
								<button type="button" class="btn btn-outline-dark w-100"
										@click="basketProduct">
									장바구니
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-5">
					<div id="product-detail-btn" class="btn-group d-flex w-100" role="group" aria-label="..." style="height:60px;"> 
						<button type="button" class="btn btn-light w-100 active"
							data-view="1"
							@click="changeView($event)">
							상품정보
						</button> 
						<button type="button" class="btn btn-light w-100"
							data-view="2"
							@click="changeView($event)">
							상품후기
						</button> 
						<button type="button" class="btn btn-light w-100"
							data-view="3"
							@click="changeView($event)">
							Q&A
						</button> 
					</div>
				</div>
				
				<div id="product-detail-view" class="border pt-5 pb-5">
					<!-- 상품 상세정보 -->
					<div id="detail-1" class="viewer_cont detail-view" v-html="productInfo.PRODUCT_DETAIL"></div>
					
					<!-- 상품 후기(1 : 일반 후기, 2 : 상품 사진 후기, 3 : 익명 후기) -->
					<div id="detail-2" class="detail-view display-none">
						<product-review-form :productId="productId"></product-review-form>
					</div>
					
					<!-- 상품 Q&A -->
					<div id="detail-3" class="detail-view display-none">
						<product-qna-form :productId="productId"></product-qna-form>
					</div>
				</div>
				
			</div>
		</div>
	`,
	data(){
		return{
			productId: "",			// 상품 ID
			productInfo: {},		// 상품 정보
			productPayInfo: [],		// 구매할 내역
			obj: {					// select Option
				id: "product-size",
				name: "product-size",
				class: "form-control",
				allView: true,
				allViewNm: "사이즈 선택",
				selected: "",
				options: []
			}
		}
	},
	computed: {
		// 이미지 리스트
		imgList(){
			if(!this.productInfo.FILE_REAL_NM) return false;
			
			let fileSrc = this.productInfo.FILE_REAL_NM.split(' ');
			
			for(var i in fileSrc){
				fileSrc[i] = server + this.productInfo.FILE_SRC + fileSrc[i];
			}
			
			return fileSrc;
		},
		// 첫번째 이미지
		repImg(){
			if(!this.productInfo.FILE_REAL_NM) return false;

			let fileSrc = this.productInfo.FILE_REAL_NM.split(' ');
			
			return server + this.productInfo.FILE_SRC + fileSrc[0];
		},
		buyFinalPrice(){
			let finalPrice = 0;
			$.each(this.productPayInfo, function(idx, item){
				finalPrice += item.finalPrice;
			});
			return finalPrice;
		}
	},
	methods : {
		// 상품 정보 조회 (상품정보 , 리뷰)
		getProductInfo(){
			httpRequest({
				url: "product/" + this.productId,
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				this.productInfo = rs.data.productInfo;
				
				// select 박스 Product Size
				let options = [];
				
				let productSize = this.productInfo.PRODUCT_SIZE.split(' ');
				let productCnt = this.productInfo.PRODUCT_CNT.split(' ');
				let productNo = this.productInfo.PRODUCT_NO.split(' ');
				
				$.each(productSize, function(idx, item){
					let option = {CMN_CD: productNo[idx], CMN_NM: item};
					if(productCnt[idx] < 1) option.disabled= true;
					options.push(option);
				});
				
				this.obj.options = options;
			})
			.catch((error) => {
				console.log(error);
			});
			
		},
		// 조회수 Update
		updateViewCount(){
			let productId = this.productId;
			
			httpRequest({
				url: "product/update/view/" + productId,
				method: "POST",
				responseType: "json"
			})
			.then((rs) => {
				
			})
			.catch((error) => {
				console.log(error);
			});
			
		},
		// 구매내역 추가
		addProduct(value){
			let isPayInfo = true;
			// 0. 값이 선택되었는지 체크
			if(!value) return false;
			
			// 1. productSize(value) 의 값이 있는지 체크
			$.each(this.productPayInfo, function(idx, item){
				let productNo = item.product_no;
				if(value == productNo){
					alert("이미 선택된 상품입니다.");
					isPayInfo = false;
				}
			})
			
			let productNo = this.productInfo.PRODUCT_NO.split(' ');
			let productPriceDiscount = this.productInfo.PRICE_DISCOUNT.split(' ');
			
			let idx = productNo.indexOf(value);
			let priceDiscount = productPriceDiscount[idx];	// 상품 할인율
			let price = this.productInfo.PRICE;
			
			// 2. 없으면 새로 추가.
			if(isPayInfo){
				let payInfo = {product_no: value
								, product_nm: this.productInfo.PRODUCT_NAME
								, product_cnt: 1
								, product_size: $("#product-size [value='" + value + "']").text()
								, price: price
								, priceDiscount: priceDiscount
								, totPrice: price
								, finalPrice: price - (price * (priceDiscount / 100))};
				
				this.productPayInfo.push(payInfo);
			}
		},
		// 구매내역 삭제
		removeProduct(value){
			let obj = this.productPayInfo;
			
			let findItem = obj.find(function(item){
				return item.product_no === value;
			});
			
			let idx = obj.indexOf(findItem);
			
			this.productPayInfo.splice(idx,1);
		},
		// 상품 구매갯수 변경
		productCntChange(value, cnt){
			let obj = this.productPayInfo;
			
			let findItem = obj.find(function(item){
				return item.product_no === value;
			});
			
			let idx = obj.indexOf(findItem);
			let productCnt = obj[idx].product_cnt;
			let price = obj[idx].price;
			let discount = obj[idx].priceDiscount;
			
			if(productCnt == 1 && cnt == -1){
				return false;
			}
			
			obj[idx].product_cnt = productCnt + cnt;
			
			obj[idx].totPrice = (price * obj[idx].product_cnt);
			let totPrice = obj[idx].totPrice;
			obj[idx].finalPrice = totPrice - (totPrice * (discount / 100));
		},
		// 상품 구매
		buyProduct(){
			// 선택된 상품이 있는지 체크
			if(this.productPayInfo.length < 1){
				alert("선택된 상품이 없습니다.");
				return false;
			} else{
				if(confirm("해당 상품을 구매하시겠습니까?")){
					
					let data = [];
					$.each(this.productPayInfo, function(idx, item){
						data.push({"product_no" : item.product_no, "product_cnt" : item.product_cnt});
					});
					
					httpRequest({
						url: "product/stock/check",
						method: "POST",
						responseType: "json",
						data: data
					})
					.then((rs) => {
						this.$router.push({name: "pay-list-form", params:{payInfo: "product"}, query: {productPayInfo: JSON.stringify(data)} });
					})
					.catch((error) => {
						alert(error.data.message);
					});
					
				}
			}
		},
		// 장바구니
		basketProduct(){
			
			// 선택된 상품이 있는지 체크
			if(this.productPayInfo.length < 1){
				alert("선택된 상품이 없습니다.");
				return false;
			}
			let data = this.productPayInfo;
			
			// 장바구니 추가
			httpRequest({
				url: "user/product/basket/add",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				if(rs.data.result > 0){
					if(confirm("장바구니로 이동하시겠습니까?")){
						this.$router.push({ name: "basket-form" });
					}
				} else {
					console.log("장바구니로 이동할 수 없습니다.\n관리자에게 문의해주세요.");
				}
			})
			.catch((error) => {
				alert(error.data.message);
			});
			
		},
		// 이미지 변경
		changeImg(e){
			let listImg = e.currentTarget.src;
			
			// border
			$('.list-image').removeClass('border-primary');
			e.currentTarget.classList.add('border-primary');
			
			// Img Src
			$('#repImg').attr("src", listImg);
		},
		// 상품 관련 내용 변경
		changeView(e){
			$('#product-detail-btn button').removeClass('active');
			e.currentTarget.classList.add('active');
			
			let view = e.currentTarget.dataset.view;
			$('#product-detail-view .detail-view').addClass("display-none");
			$('#detail-' + view).removeClass("display-none");
		}
	},
	created() {
		this.productId = this.$route.params.productId;
		this.getProductInfo();
		this.updateViewCount();
	}
});