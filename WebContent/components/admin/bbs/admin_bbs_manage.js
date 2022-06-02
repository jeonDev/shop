const adminBbsManageComponent = Vue.component('admin-bbs-manage-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>게시글 관리</h2>
			</div>
			<div id="admin-bbs-list">
			
				<!-- 조회조건 -->
				<div class="d-flex justify-content-end mb-3">
					<div class="p-1">
						<button type="button" class="btn btn-dark" data-bbs-type="NOTICE"
							@click="bbsManage">공지사항 추가</button>
					</div>
					<div class="p-1">
						<button type="button" class="btn btn-dark" data-bbs-type="FAQ" 
							@click="bbsManage">FAQ 추가</button>
					</div>
					<div class="p-1">
						<select-box :obj="bbsTypeObj"
							@input="changeBbsType"/>
					</div>
					<div class="p-1">
						<select-box :obj="wrtStateObj"
							@input="changeWrtState"/>
					</div>
					<div class="p-1">
						<input type="text" class="form-control" placeholder="제목을 검색해주세요." v-model="title"
							@keyup.enter="search">
					</div>
					<div class="p-1">
						<button type="button" class="btn btn-success" @click="search">검색</button>
					</div>
				</div>
				
				<!-- 리스트 조회 -->
				<div v-if="productQnaList.length > 0">
					<!-- 리스트 -->
					<div>
						<table class="table table-bordered">
							<colgroup>
								<col width="10px">
								<col width="10%">
								<col width="55%">
								<col width="13%">
								<col width="10%">
								<col width="20%">
							</colgroup>
							<thead>
								<tr class="text-center">
									<th>No</th>
									<th>구분</th>
									<th>제목</th>
									<th>작성자</th>
									<th>조회수</th>
									<th>작성일자</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, idx) in productQnaList"
									@click="bbsDetail(item.BBS_NO)">
									<td class="text-center">{{page.count - item.RN + 1}}</td>
									<td class="text-center">{{item.BBS_TYPE_NM}}</td>
									<td>{{item.TITLE}}</td>
									<td class="text-center">{{item.USR_NM}}</td>
									<td class="text-center">{{item.VIEW_CNT}}</td>
									<td class="text-center">{{item.SYS_ENR_DTTM}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<!-- 페이징 -->
					<div>
						<!-- Pagenation -->
						<pagenation-form :obj="page" @pageMove="pageMove"></pagenation-form>
					</div>
				</div>
				<div class="w-100 text-center mb-5" v-else>
					<h2>등록된 게시글이 없습니다.</h2>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			productQnaList: [],
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			},
			title: "",	// 검색어
			bbsType: "",
			wrtState : "",
			bbsTypeObj: {			// bbs Type Select box
				id: "bbs-type",
				name: "bbs-type",
				class: "form-control",
				allView: false,
				allViewNm: "",
				selected: "",
				options: []
			},
			wrtStateObj: {			// wrt state Select box
				id: "wrt-state",
				name: "wrt-state",
				class: "form-control",
				allView: true,
				allViewNm: "전체",
				selected: "",
				options: []
			}
		}
	},
	watch: {
		$route(){
			this.title = this.$route.query.title;
			this.bbsType = this.$route.query.bbsType;
			this.wrtState = this.$route.query.wrtState;
			this.page.curPage = this.$route.query.curPage;
			this.getBbsList();
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
				this.wrtStateObj.selected = this.wrtState;
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
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 공지사항 조회
		getBbsList(){
			
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			let blockUnit = this.page.blockUnit;
			let title = this.title;
			let bbsType = this.bbsType;
			let wrtState = this.wrtState;
			
			let data = {"bbs_type" : bbsType
					, "curPage" : curPage
					, "pageUnit" : pageUnit
					, "blockUnit" : blockUnit};
			
			if(title) data.title = title;
			if(wrtState) data.wrt_state = wrtState;
			
			httpRequest({
				url: "board/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.productQnaList = rs.data.bbsList;
				this.page = rs.data.page;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		pageMove(page){
			if(page == this.page.curPage) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.curPage = page;
			this.$router.push({ query });

			moveAnimate("admin-bbs-list");
		},
		search(){
			let query = Object.assign({}, this.$route.query);
			query.curPage = 1;
			query.title = this.title;
			this.$router.push({ query });

			moveAnimate("admin-bbs-list");
		},
		changeBbsType(typeCd){
			let query = Object.assign({}, this.$route.query);
			query.curPage = 1;
			query.bbsType = typeCd;
			this.$router.push({ query });

			moveAnimate("admin-bbs-list");
		},
		changeWrtState(typeCd){
			let query = Object.assign({}, this.$route.query);
			query.curPage = 1;
			query.wrtState = typeCd;
			this.$router.push({ query });

			moveAnimate("admin-bbs-list");
		},
		bbsDetail(bbsNo){
			let bbsType = this.bbsType;
			this.$router.push({name: "admin-bbs-write-form", params : { bbsType : bbsType }, query: {bbsNo: bbsNo}});
		},
		bbsManage(e){
			let bbsType = e.currentTarget.dataset.bbsType;
			this.$router.push({name: "admin-bbs-write-form", params: {bbsType : bbsType}});
		}
	},
	created() {
		this.title = this.$route.query.title;
		this.bbsType = this.$route.query.bbsType;
		this.wrtState = this.$route.query.wrtState;
		this.page.curPage = this.$route.query.curPage;
		if(!this.bbsType) this.bbsType = "NOTICE";
		this.getBbsList();
		this.getWrtStateMenuList();
		this.getBbsTypeMenuList();
	}
});
