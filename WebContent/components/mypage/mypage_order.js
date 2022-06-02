const mypageOrderComponent = Vue.component('mypage-order-form', {
	template: `
		<div class="container">
			<div class="mt-3 mb-3" id="payment-state-cnt">
				<span class="text-secondary p-2" v-for="(item, idx) in paymentStateCnt">
					{{ item.PAYMENT_STATE_NM }} {{ item.PAYMENT_STATE_CNT }}
				</span>
			</div>
			<div id="mypage-order-list">
				<table class="table not-table-hover">
					<colgroup>
						<col width="50%">
						<col width="15%">
						<col width="8%">
						<col width="12%">
						<col width="15%">
					</colgroup>
					<thead>
						<tr class="text-center">
							<th>상품정보</th>
							<th>주문일자</th>
							<th>주문번호</th>
							<th>주문금액<br/>(수량)</th>
							<th>주문관리</th>
						</tr>
					</thead>
					
					<tbody v-if="orderInfoList.length > 0">
						<tr v-for="(item, idx) in orderInfoList" :id="'payment_' + idx" :data-payment-no="item.PAYMENT_NO">
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
											</div>
										</router-link>
									</div>
								</div>
							</td>
							<td class="text-center align-middle">{{ dateFormat(item.ORDER_DTTM) }}</td>
							<td class="align-middle">
								<router-link :to="{name: 'order-list-form', params: { orderNo : item.ORDER_NO } }" class="a">
									{{ item.ORDER_NO }}
								</router-link>
							</td>
							<td class="text-center align-middle">
								<span>{{ item.BUY_PRICE.toLocaleString('ko-KR') }}</span><br/>
								<span class="text-secondary">( {{ item.PRODUCT_CNT.toLocaleString('ko-KR') }} )</span>
							</td>
							<td class="text-center align-middle">
								<div>
									{{ item.PAYMENT_STATE_NM }}
								</div>
								<!-- 구매확정 -->
								<div v-if="item.PAYMENT_STATE == 'BC'">
									<!-- 상품후기 버튼 -->
									<button type="button" :data-idx="'payment_' + idx" class="btn btn-dark"
										@click="goProductReview">상품후기</button>
								</div>
								<!-- 배송완료 -->
								<div v-else-if="item.PAYMENT_STATE == 'DC'">
									<!-- 구매확정 버튼 -->
									<button type="button" :data-idx="'payment_' + idx" class="btn btn-dark"
										@click="buyComplete">구매확정</button>
								</div>
							</td>
						</tr>
					</tbody>
					<tbody v-else>
						<td colspan="5" class="text-center">
							<h2>주문내역이 존재하지 않습니다.</h2>
						</td>
					</tbody>
				</table>
				
				<!-- Pagenation -->
				<pagenation-form :obj="page" @pageMove="pageMove"></pagenation-form>
			</div>
		</div>
	`,
	watch: {
		$route() {
			this.page.curPage = this.$route.query.curPage;
			this.getOrderInfoList();
		}
	},
	data() {
		return {
			paymentStateCnt : [],		// 결제상태
			orderInfoList : [],		// 주문내역 리스트
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			}
		}
	},
	methods: {
		// 주문상태별 갯수 조회
		getPaymentStateCntInfo(){
			let data = {"cmn_type" : "PAYMENT_STATE"};
			
			httpRequest({
				url: "user/payment/state/cnt", 
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.paymentStateCnt = rs.data.paymentStateCnt;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 주문내역 조회
		getOrderInfoList(){
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			let blockUnit = this.page.blockUnit;
			
			let data = {curPage: curPage,
					pageUnit: pageUnit,
					blockUnit: blockUnit};
					
			httpRequest({
				url: "user/payment/order/list",
				method: "GET",
				responseType: "json",
				params : data
			})
			.then((rs) => {
				this.orderInfoList = rs.data.orderInfo;
				this.page = rs.data.page;
			})
			.catch((error) => {
				console.log(error);
				alert(error.data.message);
			});
		},
		// 상품후기
		goProductReview(e){
			let dataIdx = e.currentTarget.dataset.idx;
			let paymentNo = $('#' + dataIdx).data().paymentNo;
			
			if(!confirm("해당 상품의 후기를 작성하시겠습니까?")) return false;
			
			this.$router.push({name: "product-review-write-form", params:{paymentNo: paymentNo} });
		},
		// 구매확정
		buyComplete(e){
			let dataIdx = e.currentTarget.dataset.idx;
			let paymentNo = $('#' + dataIdx).data().paymentNo;
			
			let data = {"payment_no" : paymentNo,
					"payment_state" : "BC"};
			
			if(!confirm("해당 상품을 구매확정 처리 하시겠습니까?")) return false;
			
			httpRequest({
				url: "user/payment/update",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.msg);
				this.getPaymentStateCntInfo();
				this.getOrderInfoList();
			})
			.catch((error) => {
				alert(error.data.message);
			});
			
		},
		pageMove(page){
			if(page == this.page.curPage) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.curPage = page;
			this.$router.push({ query });
			
			moveAnimate("mypage-order-list");
		},
		imgSrc(src){
			return server + src;
		},
		dateFormat(value){
			return dateFormat(value);
		}
	},
	created() {
		this.page.curPage = this.$route.query.curPage;
		this.getPaymentStateCntInfo();
		this.getOrderInfoList();
	}
});