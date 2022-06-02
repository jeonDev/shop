const totPriceComponent = Vue.component('tot-price', {
	props: ["priceInfo"],
	template: `
		<div class="d-flex justify-content-center border p-4 mb-5">
			<div class="d-flex justify-content-between w-75 border p-3">
				<span v-for="item in totPrice">
					{{item}}
				</span>
			</div>
		</div>
	`,
	computed: {
		totPrice(){
			let totPrice = 0;		// 총 가격
			let discountPrice = 0;	// 할인 가격
			let finalPrice = 0;		// 할인된 총 가격
			let result = [];
			
			$.each(this.priceInfo, function(idx, item){
				totPrice += item.TOT_PRICE;
				discountPrice += item.TOT_DISCOUNT_PRICE;
				finalPrice += item.FINAL_PRICE;
			});
			
			result[0] = "총 금액 : " + totPrice.toLocaleString('ko-KR');
			result[1] = " - ";
			result[2] = "할인 금액 : " + discountPrice.toLocaleString('ko-KR');
			result[3] = " = ";
			result[4] = "최종 금액  : " + finalPrice.toLocaleString('ko-KR');
			
			return result;
		}
	}
});

/*
 * priceInfo
 * 		TOT_PRICE			: 금액
 * 		TOT_DISCOUNT_PRICE	: 할인금액
 * 		FINAL_PRICE			: 최종금액
 * 
 * return : 금액정보 박스
 */