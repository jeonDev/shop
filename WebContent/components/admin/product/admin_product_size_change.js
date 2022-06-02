const adminProductListChangeComponent = Vue.component('admin-product-change-form', {
	props : ["productInfo"],
	template: `
		<div id="product-size-change" class="modal-loading display-none">
			<div class="modal-box">
				<div class="modal-box-close">
					<i class="bi bi-x-circle a"
						@click="closeModal"></i>
				</div>
				
				<div class="text-center mb-5">
					<h2>사이즈 정보 변경</h2>
				</div>
				
				<div>
					<div class="row mb-1 p-2">
						<div class="col-sm-3 font-weight-bold">
							사이즈
						</div>
						<div class="col-sm-9">
							<input type="text" class="form-control" v-model="productInfo.product_size"/>
						</div>
					</div>
					
					<div class="row mb-1 p-2">
						<div class="col-sm-3 font-weight-bold">
							할인율
						</div>
						<div class="col-sm-9">
							<input type="text" class="form-control" v-model="productInfo.price_discount"/>
						</div>
					</div>
					
					<div class="row mb-1 p-2">
						<div class="col-sm-3 font-weight-bold">
							재고량
						</div>
						<div class="col-sm-9">
							<input type="text" class="form-control" v-model="productInfo.product_cnt"/>
						</div>
					</div>
					<div class="text-center mb-2">
						<button type="button" class="btn btn-dark"
							@click="updateProductSize">변경</button>
					</div>
				</div>
			</div>
		</div>
	`,
	methods : {
		formChk(){
			let productNo = this.productInfo.product_no;
			let productSize = this.productInfo.product_size;
			let priceDiscount = this.productInfo.price_discount;
			let productCnt = this.productInfo.product_cnt;
			
			if(!productNo){
				return false;
			} else if(!productSize){
				alert("상품 사이즈를 입력해주세요.");
				return false;
			} else if(isNaN(priceDiscount) 
					|| priceDiscount < 0 || priceDiscount > 100){
				alert("할인율은 백분율(0~100)로 입력해주세요.");
				return false;
			} else if(!productCnt || isNaN(productCnt)){
				alert("재고량을 입력해주세요.");
				return false;
			}
			
			let data = {
					"product_no" 	 : productNo,
					"product_size"	 : productSize,
					"price_discount" : priceDiscount,
					"product_cnt"	 : productCnt
			};
			
			return data;
		},
		updateProductSize(){
			let data = this.formChk()
			
			if(!confirm("상품 정보를 변경하시겠습니까?")) return false;
			
			this.$emit("updateProductSize", data);
			
			this.closeModal();
		},
		// 모달 창 닫기
		closeModal(){
			$('#product-size-change').addClass('display-none');
		}
	},
	created() {
		
	}
});