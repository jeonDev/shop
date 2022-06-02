const addressComponent = Vue.component('address-form', {
	props : {
		obj :{
			type: Object,
			required : false
		}
	},
	template: `
		<div>
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="zip-cd">우편번호</label>
				</div>
				<div class="col-sm-7">
					<input type="text" class="form-control" id="zip-cd" placeholder="우편번호" maxlength="5" v-model="zipCd" readonly>
				</div>
				<div class="col-sm-3 text-right">
					<button class="btn btn-primary w-75" id="addr-btn" @click="searchLoc(callBackFunc)">검색</button> 
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="address">주소</label>
				</div>
				<div class="col-sm-10">
					<input type="text" class="form-control" id="address" placeholder="XX도 XX시 XX동" maxlength="150" v-model="address" readonly>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="adrress2">상세주소</label>
				</div>
				<div class="col-sm-10">
					<input type="text" class="form-control" id="address2" placeholder="XX빌딩" maxlength="150" v-model="address2">
				</div>
			</div>
		</div>
	`,
	data() {
		return {
			zipCd : "",
			address : "",
			address2 : ""
		}
	},
	watch:{
		zipCd() {
			this.$emit("zipCd", this.zipCd);
		},
		address() {
			this.$emit("address", this.address);
		},
		address2() {
			this.$emit("address2", this.address2);
		},
		obj() {
			this.zipCd = this.obj.ZIP_CD;
			this.address = this.obj.ADDRESS;
			this.address2 = this.obj.ADDRESS2;
		}
	},
	methods : {
		// 우편번호 검색
		searchLoc(callback){
			new daum.Postcode({
				oncomplete: function(rs) {
					
					let zipCd 	 = rs.zonecode;		// 우편번호
					let address  = rs.address;		// 주소
					let address2 = rs.buildingName;	// 상세 주소
					
					var data = {"zipCd" : zipCd,
							"address" : address,
							"address2" : address2};
					
					callback(data);
				}
			}).open();
		},
		// 주소 검색 Callback 함수
		callBackFunc(data){
			
			this.zipCd = data.zipCd;
			this.address = data.address;
			this.address2 = data.address2;
			
		},
	}
});

/*
# 입력
obj : {ZIP_CD, ADDRESS, ADDRESS2} 	--> 초기 세팅 필요 시, 추가

@ Event
@zipCd="value => userInfo.zipCd = value"
@address="value => userInfo.address = value"
@address2="value => userInfo.address2 = value"
 */