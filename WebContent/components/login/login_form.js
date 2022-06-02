const loginComponent = Vue.component('login-form', {
	template: `
		<div class="container">
			<div>
				<form>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text" style="width:100px;">아이디  </span>
						</div>
						<input type="text" class="form-control" id="id" v-model="id" @keyup.enter="login">
					</div>
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text" style="width:100px;">패스워드</span>
						</div>
						<input type="password" class="form-control" id="password" v-model="password" @keyup.enter="login">
					</div>
					<div>
						<button type="button" class="btn btn-success btn-block" @click="login">로그인</button>
						<button type="button" class="btn btn-secondary btn-block" @click="goJoinPage">회원가입</button>
					</div>
				</form>
			</div>
		</div>
	`,
	data(){
		return{
			id		 : "",
			password : ""
		}
	},
	methods: {
		// Form 체크
		formCheck(){
			let id = this.id;
			let ps = this.password;
			
			if(!id){
				alert("아이디를 입력해주세요.");
				$('#id').focus();
				return false;
			} else if(id.length < 4 || id.length > 20){
				alert("아이디는 4 ~ 20자로 입력 가능합니다.");
				$('#id').focus();
				return false;
			} else if(!ps){
				alert("패스워드를 입력해주세요.");
				$('#password').focus();
				return false;
			} else if(ps.length < 4 || ps.length > 30){
				alert("패스워드는 4 ~ 30자로 입력 가능합니다.");
				$('#password').focus();
				return false;
			}
			
			return true;
		},
		// 로그인
		login(){
			// Form Check
			if(!this.formCheck()) return false;
			
			// Login
			let data = {"id" : this.id, "password" : this.password};
			
			httpRequest({
				url: "login",
				method: "POST",
				data: data,
				withCredentials: true
			})
			.then((rs) => {
				// Access Token 저장
				if(rs.data.code == '0000'){
					let token = rs.data.accessToken;
					
					localStorage.setItem("Authorization", token);
					
					$(location).attr('href', '/shop');
				} else{
					alert(rs.data.message);
				}
			})
			.catch((error) => {
				alert(error.data.message);
			});
			
		},
		// 회원가입 페이지 이동
		goJoinPage(){
			this.$router.replace({path: "/shop/join"});
		}
	}
});