const mypageMemberInfoComponent = Vue.component('mypage-member-info-form', {
	template: `
		<div class="container">
			<div class="p-3 mb-3">
				<h2>회원정보</h2>
			</div>
			<!-- 개인정보 변경 -->
			<div class="p-3 border mb-5">
				<!-- ID 표시-->
				<div class="row mb-2 h-40">
					<div class="col-sm-3 font-weight-bold">
						아이디
					</div>
					<div class="col-sm-9">
						{{userInfo.ID}}
					</div>
				</div>
				
				<!-- 비밀번호 표시-->
				<div class="row mb-2 h-40">
					<div class="col-sm-3 font-weight-bold">
						비밀번호
					</div>
					<div class="col-sm-6">
						********
					</div>
					<div class="col-sm-3">
						<button type="button" class="btn btn-dark"
							@click="changeUserInfo('password')">정보변경</button>
					</div>
				</div>
				
				<!-- 이름 -->
				<div class="row mb-2 h-40">
					<div class="col-sm-3 font-weight-bold">
						이름
					</div>
					<div class="col-sm-6">
						{{userInfo.NAME}}
					</div>
					<div class="col-sm-3">
						<button type="button" class="btn btn-dark"
							@click="changeUserInfo('name')">정보변경</button>
					</div>
				</div>
				
				<!-- 전화번호 -->
				<div class="row mb-2 h-40">
					<div class="col-sm-3 font-weight-bold">
						전화번호
					</div>
					<div class="col-sm-6">
						{{userInfo.TEL}}
					</div>
					<div class="col-sm-3">
						<button type="button" class="btn btn-dark"
							@click="changeUserInfo('tel')">정보변경</button>
					</div>
				</div>
				
				<!-- 이메일 -->
				<div class="row mb-2 h-40">
					<div class="col-sm-3 font-weight-bold">
						이메일
					</div>
					<div class="col-sm-6">
						{{userInfo.EMAIL}}
					</div>
					<div class="col-sm-3">
						<button type="button" class="btn btn-dark"
							@click="changeUserInfo('email')">정보변경</button>
					</div>
				</div>
				
				<!-- 성별 -->
				<div class="row mb-2 h-40">
					<div class="col-sm-3 font-weight-bold">
						성별
					</div>
					<div class="col-sm-6">
						{{userInfo.SEX_NM}}
					</div>
					<div class="col-sm-3">
						<button type="button" class="btn btn-dark"
							@click="changeUserInfo('sex')">정보변경</button>
					</div>
				</div>
			</div>
			
			<!-- 주소정보 -->
			<div class="p-3 mb-3">
				<h2>배송지 정보(주소)</h2>
			</div>
			
			<div class="p-3 border mb-5">
				<!-- 주소정보 -->
				<address-form :obj="userInfo"
					@zipCd="value => userInfo.ZIP_CD = value"
					@address="value => userInfo.ADDRESS = value"
					@address2="value => userInfo.ADDRESS2 = value"/>
				
				<div class="row mb-2 h-40">
					<div class="col-sm-12 text-secondary">
						<div>* 해당 주소 정보는 결제 시, 기본 배송지 정보로 설정됩니다.</div>
						<div>* 결제 시, 배송지 정보는 변경 가능합니다.</div>
					</div>
				</div>
				<div class="text-center">
					<button type="button" class="btn btn-dark"
						@click="changeAddrInfo">정보변경</button>
				</div>
			</div>
			
			<!-- 회원 탈퇴 -->
			<div class="text-center">
				<button type="button" class="btn btn-danger"
						@click="userDelete">회원탈퇴</button>
			</div>
			
			<!-- modal 정보변경 창 -->
			<member-info-change-form :userInfo="UserInfoData"
				@getUserInfo="getUserInfo"/>
			
		</div>
	`,
	data() {
		return {
			userInfo : {},		// 사용자 정보
			UserInfoData : {	// modal에 넘겨질 정보
				info : ''
			}	
		}
	},
	computed: {

	},
	methods: {
		// 사용자 정보 조회
		getUserInfo(){
			
			httpRequest({
				url: "user/get/info",
				method: "GET", 
				responseType: "json"
			})
			.then((rs) => {
				this.userInfo = rs.data.userInfo;
				console.log(this.userInfo);
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		changeUserInfo(v){
			let obj = this.userInfo;
			let data = this.UserInfoData;
			
			data.info = v;
			
			if(v == 'password'){
				data.title = "패스워드";
				data.value = "";
			} else if( v == 'name') {
				data.title = "이름";
				data.value = obj.NAME;
			} else if( v == 'tel') {
				data.title = "전화번호";
				data.value = obj.TEL;
			} else if( v == 'email') {
				data.title = "이메일";
				data.value = obj.EMAIL;
			} else if( v == 'sex') {
				data.title = "성별";
				data.value = obj.SEX;
			}
			
			$('#member-info-change').removeClass('display-none');
		},
		addrFormChk(){
			let zipCd = this.userInfo.ZIP_CD;
			let address = this.userInfo.ADDRESS;
			let address2 = this.userInfo.ADDRESS2;
			
			if(zipCd.length != 5) {
				alert("우편번호를 입력해주세요.");
				$('#zip-cd').focus();
				return false;
			} else if(address.length < 1) {
				alert("주소를 입력해주세요.");
				$('#address').focus();
				return false;
			} else if(address2.length < 1) {
				alert("상세 주소를 입력해주세요.");
				$('#address2').focus();
				return false;
			}
			
			return true;
		},
		changeAddrInfo(){
			
			if(!this.addrFormChk()) return false;
			
			if(!confirm("배송지 정보를 수정하시겠습니까?")) return false;
			
			let zipCd = this.userInfo.ZIP_CD;
			let address = this.userInfo.ADDRESS;
			let address2 = this.userInfo.ADDRESS2;
			
			let data = {
					'zip_cd' : zipCd,
					'address' : address,
					'address2' : address2
			};
			
			httpRequest({
				url: "user/info/update",
				method: "POST", 
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.message);
				this.getUserInfo();
				moveAnimate("mypage-detail-view");
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		// 회원탈퇴
		userDelete() {
			
			if(!confirm("회원 탈퇴를 하시겠습니까?")) return false;
			
			httpRequest({
				url: "user/info/delete",
				method: "POST", 
				responseType: "json"
			})
			.then((rs) => {
				alert(rs.data.message);
				this.$router.push({ name: "logout-form" });
			})
			.catch((error) => {
				alert(error.data.message);
			});
		}
	},
	created() {
		this.getUserInfo();
	}
});