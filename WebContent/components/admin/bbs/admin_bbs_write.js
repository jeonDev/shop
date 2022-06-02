const adminBbsWriteComponent = Vue.component('admin-bbs-write-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>게시글 등록</h2>
			</div>
			<!-- 게시글 내용 -->
			<div class="border mb-5">
				<div class="row m-2 p-2">
					<div class="col-sm-2 font-weight-bold">
						제목
					</div>
					<div class="col-sm-10">
						<input type="text" class="form-control" v-model="bbsInfo.TITLE" placeholder="제목을 입력해주세요."/>
					</div>
				</div>
				<!-- 상품 문의에서만 -->
				<div class="row m-2 p-2" v-if="bbsType == 'PRODUCT_QNA'">
					<div class="col-sm-2 font-weight-bold">
						상품 확인
					</div>
					<div class="col-sm-10">
						<router-link :to="{name: 'product-detail-form', params: { productId : bbsInfo.PRODUCT_ID } }" class="btn btn-dark">
							확인 하러가기
						</router-link>
					</div>
				</div>
				<div class="row m-2 p-2">
					<div class="col-sm-2 font-weight-bold">
						작성자
					</div>
					<div class="col-sm-10">
						<input type="text" class="form-control" v-model="bbsInfo.USR_NM" readonly/>
					</div>
				</div>
				<div class="row m-2 p-2">
					<div class="col-sm-2 font-weight-bold">
						작성일자
					</div>
					<div class="col-sm-10">
						<input type="text" class="form-control" v-model="bbsInfo.SYS_ENR_DTTM" placeholder="작성일자(입력 불가)" readonly/>
					</div>
				</div>
				<div class="row m-2 p-2">
					<div class="col-sm-2 font-weight-bold">
						작성구분
					</div>
					<div class="col-sm-10">
						<select-box :obj="bbsTypeObj"
							@input="value => bbsInfo.BBS_TYPE = value"/>
					</div>
				</div>
				<div class="row m-2 p-2">
					<div class="col-sm-2 font-weight-bold">
						작성상태
					</div>
					<div class="col-sm-10">
						<select-box :obj="wrtStateObj"
							@input="value => bbsInfo.WRT_STATE = value"/>
					</div>
				</div>
				<div class="row m-2 p-2">
					<div class="col-sm-2">
						내용
					</div>
					<div class="col-sm-10">
						<textarea id="content" class="w-100" rows="10" cols="10"></textarea>
					</div>
				</div>
			</div>
			<div class="d-flex justify-content-center">
				<button type="button" class="btn btn-dark m-1"
					@click="save">등록</button>
				<button type="button" class="btn btn-dark m-1"
					v-if="bbsNo"
					@click="deleteBbs">삭제</button>
			</div>
		</div>
	`,
	data(){
		return{
			bbsNo : "",
			bbsType : "",
			bbsInfo : {
				USR_NM : NAME
			},
			wrtStateObj: {			// wrt state Select box
				id: "wrt-state",
				name: "wrt-state",
				class: "form-control",
				allView: true,
				allViewNm: "선택",
				selected: "",
				options: []
			},
			bbsTypeObj: {			// bbs Type Select box
				id: "bbs-type",
				name: "bbs-type",
				class: "form-control",
				allView: false,
				allViewNm: "",
				selected: "",
				options: []
			}
		}
	},
	methods : {
		// WRT_STATE
		getWrtStateMenuList(){
			let data = {"cmn_type" : "WRT_STATE"};
			
			httpRequest({
				url: "get/code/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.wrtStateObj.options = rs.data;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// BBS_TYPE
		getBbsTypeMenuList(){
			let data = {"cmn_type" : "BBS_TYPE"};
			
			httpRequest({
				url: "get/code/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.bbsTypeObj.options = rs.data;
				this.bbsTypeObj.selected = this.bbsType;
				if(!this.bbsNo) this.bbsInfo.BBS_TYPE = this.bbsType;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 게시글 조회
		getBbsInfo(){
			let bbsNo = this.bbsNo;
			
			if(!bbsNo) return false;
			
			httpRequest({
				url: "board/" + bbsNo,
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				this.bbsInfo = rs.data.bbsInfo;
				this.wrtStateObj.selected = this.bbsInfo.WRT_STATE;
				smartEditor(this.bbsInfo.CONTENT);
			})
			.catch((error) => {
				console.log(error);
			});
		},
		formChk(){
			let title = this.bbsInfo.TITLE;
			let bbsType = this.bbsInfo.BBS_TYPE;
			let wrtState = this.bbsInfo.WRT_STATE;
			let content = this.saveEditor();
			let bbsNo = this.bbsNo;
			
			if(!title) {
				alert("제목을 입력해주세요.");
				$('#title').focus();
				return false;
			} else if(!bbsType) {
				alert("작성구분을 선택해주세요.");
				$('#bbs-type').focus();
				return false;
			} else if(!wrtState) {
				alert("작성 상태를 입력해주세요.");
				$('#wrt-state').focus();
				return false;
			} else if(!content) {
				alert("내용을 입력해주세요.");
				$('#content').focus();
				return false;
			}
			
			let data = {
					'title' : title,
					'bbs_type' : bbsType,
					'wrt_state' : wrtState,
					'content' : content
			}
			console.log(bbsType);
			if(bbsType == "PRODUCT_QNA") data.wrt_state = "40";
			if(bbsNo) data.bbs_no = bbsNo;
			
			
			return data;
		},
		save(){
			let data = this.formChk();
			
			if(!data) return false;
			
			if(!confirm("저장하시겠습니까?")) return false;
			
			let bbsNo = this.bbsNo;
			
			let url = this.bbsNo ? "user/board/update" : "user/board/create";
			
			this.updateBbs(url, data);
		},
		deleteBbs(){
			if(!confirm("삭제하시겠습니까?")) return false;
			
			let bbsNo = this.bbsNo;
			let url = "user/board/update";
			
			let data = {bbs_no : bbsNo,
						del_yn : "Y"};
						
			this.updateBbs(url, data);
		},
		updateBbs(url, data){
			httpRequest({
				url: url,
				method: "POST",
				responseType: "json",
				data : data
			})
			.then((rs) => {
				alert(rs.data.message);
				if(this.bbsNo){
					this.$router.go();
				} else {
					let query = Object.assign({}, this.$route.query);
					query.bbsNo = rs.data.bbsNo;
					this.$router.push({ query });
				}
				
			})
			.catch((error) => {
				alert(error.data.message);
				this.$router.push({name : "admin-bbs-manage-form"});
			});
		},
		// editor 저장
		saveEditor(){
			let content = saveEditor("content");
			
			return content;
		},
		async init(){
			this.bbsType = this.$route.params.bbsType;
			this.bbsNo = this.$route.query.bbsNo;
			if(this.bbsNo){
				await this.getBbsInfo();
			}
			await this.getBbsTypeMenuList();
			await this.getWrtStateMenuList();
		}
	},
	async created() {
		this.init();
	},
	mounted() {
		if(!this.bbsNo) smartEditor("");
	}
});
