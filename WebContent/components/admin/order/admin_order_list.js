const adminOrderComponent = Vue.component('admin-order-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>주문관리</h2>
			</div>
			<div id="admin-order-list">
				
				<!-- 조회조건 -->
				<div class="d-flex justify-content-end mb-3">
					<div class="p-2">
						<select-box :obj="paymentStateObj"
							@input="changePaymentState"/>
					</div>
					<div class="p-2">
						<button class="btn btn-dark">주문관리</button>
					</div>
				</div>
				
				<div>
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
									<select class="form-control" v-model="item.PAYMENT_STATE" :data-payment-no="item.PAYMENT_NO"
										@input="changePaymentStateInfo">
										<option :value="objItem.CMN_CD" 
												:key="objItem.CMN_CD" 
												v-for="(objItem, idx) in paymentStateObj.options">
										{{objItem.CMN_NM}}
										</option>
									</select>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<td colspan="5" class="text-center">
								<h2>주문내역이 존재하지 않습니다.</h2>
							</td>
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
			this.paymentState = this.$route.query.paymentState;
			this.page.curPage = this.$route.query.curPage;
			this.getOrderInfoList();
		}
	},
	data() {
		return {
			paymentState : "",
			orderInfoList : [],
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			},
			paymentStateObj : {
				id : "payment-state",
				name : "payment_state",
				class : "form-control",
				allView : true,
				allViewNm : "전체",
				selected: "",
				options : []
			}
		}
	},
	methods : {
		// PRODUCT_STATE
		getPaymentStateList(){
			let data = {"cmn_type" : "PAYMENT_STATE"};
			
			httpRequest({
				url: "get/code/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.paymentStateObj.options = rs.data;
				this.paymentStateObj.selected = this.paymentState;
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
			let paymentState = this.paymentState;
			
			let data = {curPage: curPage,
					pageUnit: pageUnit,
					blockUnit: blockUnit};
					
			if(paymentState) data.payment_state = paymentState;
			
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
		// 결제상태 정보 변경
		changePaymentStateInfo(e){
			let paymentState = e.currentTarget.value;
			let paymentNo = e.currentTarget.dataset.paymentNo;
			let paymentStateNm = e.currentTarget.options[e.currentTarget.options.selectedIndex].text;
			
			let data = {"payment_no" : paymentNo,
					"payment_state" : paymentState};
			
			let msg = "해당 상품을 " + paymentStateNm + "처리 하시겠습니까?";
			
			if(!confirm(msg)) return false;
			
			httpRequest({
				url: "user/payment/update",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.msg);
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
			
			moveAnimate("admin-order-list");
		},
		changePaymentState(typeCd){
			if(typeCd == this.paymentState) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.paymentState = typeCd;
			query.curPage = 1;
			this.$router.push({ query });
			
			moveAnimate("admin-order-list");
		},
		imgSrc(src){
			return server + src;
		},
		dateFormat(value){
			return dateFormat(value);
		}
	},
	created() {
		this.paymentState = this.$route.query.paymentState;
		this.page.curPage = this.$route.query.curPage;
		this.getOrderInfoList();
		this.getPaymentStateList();
	}
});
