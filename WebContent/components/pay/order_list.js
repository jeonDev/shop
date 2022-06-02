const orderListComponent = Vue.component('order-list-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>주문정보
					<span class="text-secondary">({{orderNo}})</span>
				</h2>
			</div>
			
			<!-- 주문 정보 -->
			<div class="mb-5">
				<table class="table not-table-hover">
					<colgroup>
						<col width="50%">
						<col width="15%">
						<col width="12%">
						<col width="15%">
					</colgroup>
					<thead>
						<tr class="text-center">
							<th>상품정보</th>
							<th>주문일자</th>
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
							<td class="text-center align-middle">
								<span>{{ item.BUY_PRICE.toLocaleString('ko-KR') }}</span><br/>
								<span class="text-secondary">( {{ item.PRODUCT_CNT.toLocaleString('ko-KR') }} )</span>
							</td>
							<td class="text-center align-middle">
								<div>
									{{ item.PAYMENT_STATE_NM }}
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
			</div>
			
			<!-- 배송지 정보 -->
			<div class="border p-5">
				<div class="mb-5">
					<h2>배송지 정보</h2>
				</div>
				<div class="row p-3 border-bottom">
					<div class="col-sm-2 font-weight-bold">
						이름
					</div>
					<div class="col-sm-10">
						{{ buyerInfo.BUYER_NAME }}
					</div>
				</div>
				<div class="row p-3 border-bottom">
					<div class="col-sm-2 font-weight-bold">
						연락처
					</div>
					<div class="col-sm-10">
						{{ buyerInfo.BUYER_TEL }}
					</div>
				</div>
				<div class="row p-3 border-bottom">
					<div class="col-sm-2 font-weight-bold">
						이메일
					</div>
					<div class="col-sm-10">
						{{ buyerInfo.BUYER_EMAIL }}
					</div>
				</div>
				<div class="row p-3 border-bottom">
					<div class="col-sm-2 font-weight-bold">
						주소
					</div>
					<div class="col-sm-10">
						{{ buyerInfo.BUYER_ADDR }}
					</div>
				</div>
				<div class="row p-3 border-bottom">
					<div class="col-sm-2 font-weight-bold">
						메모
					</div>
					<div class="col-sm-10">
						{{ buyerInfo.MEMO }}
					</div>
				</div>
			</div>
		</div>
	`,
	data() {
		return {
			orderInfoList : [],		// 주문 정보
			buyerInfo: {},			// 배송지 정보
			orderNo : ""			// 주문 번호
		}
	},
	methods: {
		// 주문내역 조회
		getOrderInfoList(){
			let orderNo = this.orderNo;
			
			let data = {'order_no' : orderNo};
			
			httpRequest({
				url: "user/payment/order/list",
				method: "GET",
				responseType: "json",
				params : data
			})
			.then((rs) => {
				this.orderInfoList = rs.data.orderInfo;
				let data = this.orderInfoList[0];
				this.buyerInfo = {
						BUYER_EMAIL : data.BUYER_EMAIL,
						BUYER_NAME : data.BUYER_NAME,
						BUYER_TEL : data.BUYER_TEL,
						BUYER_ADDR : data.BUYER_ADDR,
						BUYER_POSTCODE : data.BUYER_POSTCODE,
						MEMO : data.MEMO
				}
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		imgSrc(src){
			return server + src;
		},
		dateFormat(value){
			return dateFormat(value);
		}
	},
	created() {
		this.orderNo = this.$route.params.orderNo;
		this.getOrderInfoList();
	}
});