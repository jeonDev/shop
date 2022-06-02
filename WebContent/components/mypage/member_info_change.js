const memberInfoChangeComponent = Vue.component('member-info-change-form', {
	props: ["userInfo"],
	template: `
		<div id="member-info-change" class="modal-loading display-none">
			<div class="modal-box">
				<div class="modal-box-close">
					<i class="bi bi-x-circle a"
						@click="closeModal"></i>
				</div>
				
				<div class="text-center mb-5">
					<h2>회원 정보 변경</h2>
				</div>
				
				<div>
					<div class="row mb-5 p-2">
						<div class="col-sm-3 font-weight-bold">
							{{ userInfo.title }}
						</div>
						<div class="col-sm-9">
							<select-box :obj="obj" v-model="userInfo.value" @input="value => userInfo.value = value" v-if="userInfo.info == 'sex'"/>
							<input :type="userInfo.info == 'password' ? 'password' : 'text'" id="value" class="form-control" v-model="userInfo.value" placeholder="변경할 정보를 입력해주세요." v-else
								@keyup.enter="updateUserInfo"/>
						</div>
						
					</div>
					
					<div class="text-center mb-2">
						<button type="button" class="btn btn-dark"
							@click="updateUserInfo">변경</button>
					</div>
				</div>
			</div>
		</div>
	`,
	data() {
		return {
			obj : {						// 성별 체크박스
				id : "sex",
				name : "sex",
				class : "custom-select d-block w-100",
				allView : false,
				allViewNm : "",
				selected: "",
				options : []
			}
		}
	},
	methods: {
		// 성별 체크박스 세팅
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
		formChk(){
			let info = this.userInfo.info;
			
			if(info == 'password') {
				if(!psReg.test(this.userInfo.value)){
					alert("패스워드는 영문과 숫자 조합으로 8~30글자를 입력해주세요.");
					$('#value').focus();
					return false;
				}
			} else if( info == 'name') {
				if(!nmReg.test(this.userInfo.value)){
					alert("이름은 한글 2~4글자로 입력 가능합니다.");
					$('#value').focus();
					return false;
				}
			} else if( info == 'tel') {
				if(!telReg.test(this.userInfo.value)){
					alert("전화번호는 -없이 입력해주세요.");
					$('#value').focus();
					return false;
				}
			} else if( info == 'email') {
				if(!mailReg.test(this.userInfo.value)){
					alert("이메일 형식에 맞게 입력해주세요.");
					$('#value').focus();
					return false;
				}
			} else if( info == 'sex') {
				if(!this.userInfo.value){
					alert("성별을 선택 해주세요.");
					$('#sex').focus();
					return false;
				}
			}
			return true;
		},
		// 사용자 정보 변경
		updateUserInfo(){
			
			if(!this.formChk()) return false;
			
			if(!confirm("회원 정보를 수정하시겠습니까?")) return false;
			
			let info = this.userInfo.info;
			let data = {};
			
			if(info == 'password') {
				data.password = this.userInfo.value;
			} else if( info == 'name') {
				data.name = this.userInfo.value;
			} else if( info == 'tel') {
				data.tel = this.userInfo.value;
			} else if( info == 'email') {
				data.email = this.userInfo.value;
			} else if( info == 'sex') {
				data.sex = this.userInfo.value;
			}
			
			httpRequest({
				url: "user/info/update",
				method: "POST", 
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.message);
				this.$emit('getUserInfo');
				this.closeModal();
				moveAnimate("mypage-detail-view");
			})
			.catch((error) => {
				alert(error.data.message);
			});
		},
		// 모달 창 닫기
		closeModal(){
			$('#member-info-change').addClass('display-none');
		}
	},
	created() {
		this.getMenuList();
	}
});