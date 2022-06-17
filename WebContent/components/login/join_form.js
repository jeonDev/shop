const joinComponent = Vue.component('join-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>회원가입</h2>
			</div>
				
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="id">아이디</label>
				</div>
				<div class="col-sm-10">
					<input type="text" class="form-control" id="id" placeholder="아이디(ID)" maxlength="30" v-model="user.id">
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="password">패스워드</label>
				</div>
				<div class="col-sm-10">
					<input type="password" class="form-control" id="password" placeholder="패스워드(PassWord)" maxlength="30" v-model="user.password">
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="name">이름</label>
				</div>
				<div class="col-sm-4">
					<input type="text" class="form-control" id="name" placeholder="이름" maxlength="10" v-model="user.name">
				</div>
				<div class="col-sm-2">
					<label for="email">이메일</label>
				</div>
				<div class="col-sm-4">
					<input type="text" class="form-control" id="email" placeholder="이메일(email@naver.com)" maxlength="100" v-model="user.email">
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="tel">전화번호</label>
				</div>
				<div class="col-sm-7">
					<input type="text" class="form-control" id="tel" placeholder="전화번호(-없이)" maxlength="11" v-model="user.tel">
				</div>
				<div class="col-sm-3 text-right">
					<button class="btn btn-primary w-75" id="tel-cert-req" @click="reqTelCert">인증번호 요청</button>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-sm-2">
					<label for="tel-cert">인증번호</label>
				</div>
				<div class="col-sm-7">
					<input type="text" class="form-control" id="tel-cert" placeholder="인증번호 4자리" maxlength="4" v-model="user.telCert">
				</div>
				<div class="col-sm-3 text-right">
					<button class="btn btn-primary w-75" id="tel-cert" @click="telCert">인증번호 확인</button> 
				</div>
			</div>
			
			<address-form
				@zipCd="value => user.zip_cd = value"
				@address="value => user.address = value"
				@address2="value => user.address2 = value"/>
			
			<div class="row mb-5">
				<div class="col-sm-2">
					<label for="sex">성별</label>
				</div>
				<div class="col-sm-10">
					<select-box :obj="obj" @input="value => user.sex = value"/>
				</div>
			</div>
			<div class="p-3">
				<button class="btn btn-primary btn-lg btn-block" @click="join">가입 완료</button> 
			</div>
		</div>
	`,
	data() {
		return{
			obj : {
				id : "sex",
				name : "sex",
				class : "custom-select d-block w-100",
				allView : true,
				allViewNm : "성별 선택",
				selected: "",
				options : []
			},
			user : {
				id		 : "",
				password : "",
				name	 : "",
				email	 : "",
				tel		 : "",
				telCert	 : "",
				certSeq	 : "",
				certSuc	 : false,
				zip_cd	 : "",
				address	 : "",
				address2 : "",
				sex		 : ""
			}
		}
	},
	methods: {
		getMenuList(){
			let data = {"cmn_type" : "SEX"};
			
			httpRequest({
				url: "get/code/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.obj.options = rs.data;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 전화번호 인증번호 전송
		reqTelCert(){
			let telReg	= /^\d{2,3}\d{3,4}\d{4}$/;
			
			if(!telReg.test(this.user.tel)){
				alert("전화번호를 입력해주세요.(-없이)");
				$('#tel').focus();
				return false;
			}
			
			let data = {"div_cd" : this.user.tel};
			
			httpRequest({
				url: "req/cert",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				console.log("인증번호 : " + rs.data.certNum);
				if(rs.data.code == '0000'){
					alert(rs.data.msg);
				}
				this.user.certSeq = rs.data.certSeq;
			})
			.catch((error) => {
				console.log(error);
				alert(error.data.message);
			})
		},
		// 전화번호 인증번호 확인
		telCert(){
			
			if(this.user.telCert == ''){
				alert('인증번호를 입력해주세요.');
				$('#tel-cert').focus();
				return false;
			}
			
			let data = {"cert_seq" : this.user.certSeq
						, "cert_num" : this.user.telCert};
			console.log(this.user.telCert);
			
			httpRequest({
				url: "cert/check",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				if(rs.data.code == "0000"){
					alert(rs.data.msg);
					this.user.certYn = rs.data.certYn;
				}
			})
			.catch((error) => {
				alert(error.data.message);
			})
		},
		// Form 체크
		formChk(){
			
			if(!idReg.test(this.user.id)){
				alert("아이디는 영문 및 숫자 4~30글자를 입력해주세요.");
				$('#id').focus();
				return false;
			} else if(!psReg.test(this.user.password)){
				alert("패스워드는 영문과 숫자 조합으로 8~30글자를 입력해주세요.");
				$('#password').focus();
				return false;
			} else if(!nmReg.test(this.user.name)){
				alert("이름은 한글 2~4글자로 입력 가능합니다.");
				$('#name').focus();
				return false;
			} else if(!mailReg.test(this.user.email)){
				alert("이메일 형식에 맞게 입력해주세요.");
				$('#email').focus();
				return false;
			} else if(!telReg.test(this.user.tel)){
				alert("전화번호는 -없이 입력해주세요.");
				$('#tel').focus();
				return false;
			} else if(!this.user.zip_cd && !this.user.address && !this.user.address2){
				alert("주소를 입력해주세요.");
				$('#addr-btn').focus();
				return false;
			} else if(this.user.certYn != "Y"){ // 인증번호 4자리
				alert("전화번호 인증을 완료해주세요.");
				$('#tel-cert').focus();
				return false;
			} else if(!this.user.sex){
				alert("성별을 선택 해주세요.");
				$('#sex').focus();
				return false;
			}
			
			return true;
		},
		// 회원가입
		join(){
			
			if(!this.formChk()) return false;
			
			let data = this.user;
			
			// 회원가입
			httpRequest({
				url: "join",
				method: "POST",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				if(rs.data.code == '0000'){
					alert(rs.data.msg);
					this.$router.replace({path: "/shop/login"});
				} else{
					alert(rs.data.msg);
				}
			})
			.catch((error) => {
				alert(error.data.message);
			})
		}
	},
	created() {
		this.getMenuList();
	}
});