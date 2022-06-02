const noticeComponent = Vue.component('notice-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>공지사항</h2>
			</div>
			<div id="notice-list">
				<!-- 조회조건 -->
				<div class="d-flex justify-content-end mb-3">
					<div>
						<input type="text" class="form-control" placeholder="제목을 검색해주세요." v-model="title"
							@keyup.enter="search">
					</div>
					<div>
						<button type="button" class="btn btn-success" @click="search">검색</button>
					</div>
				</div>
				<!-- 리스트 조회 -->
				<div v-if="noticeList.length > 0">
					<!-- 리스트 -->
					<div>
						<table class="table table-bordered">
							<colgroup>
								<col width="10px">
								<col width="55%">
								<col width="15%">
								<col width="12%">
								<col width="20%">
							</colgroup>
							<thead>
								<tr class="text-center">
									<th>No</th>
									<th>제목</th>
									<th>작성자</th>
									<th>조회수</th>
									<th>작성일자</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, idx) in noticeList"
									@click="noticeDetail(item.BBS_NO)">
									<td class="text-center">{{page.count - item.RN + 1}}</td>
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
					<h2>등록된 공지사항이 없습니다.</h2>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			noticeList: [],
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			},
			title: ""	// 검색어
		}
	},
	watch: {
		$route(){
			this.title = this.$route.query.title;
			this.page.curPage = this.$route.query.curPage;
			this.getNoticeList();
		}
	},
	methods : {
		// 공지사항 조회
		getNoticeList(){
			
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			let blockUnit = this.page.blockUnit;
			let title = this.title;
			
			let data = {"bbs_type" : "NOTICE"
					, "curPage" : curPage
					, "pageUnit" : pageUnit
					, "blockUnit" : blockUnit};
			
			if(title) data.title = title;
			
			httpRequest({
				url: "board/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.noticeList = rs.data.bbsList;
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

			moveAnimate("notice-list");
		},
		search(){
			let query = Object.assign({}, this.$route.query);
			query.curPage = 1;
			query.title = this.title;
			this.$router.push({ query });

			moveAnimate("notice-list");
		},
		noticeDetail(bbsNo){
			this.$router.push({name: "notice-detail-form", params : { bbsNo : bbsNo } });
		}
	},
	created() {
		this.title = this.$route.query.title;
		this.page.curPage = this.$route.query.curPage;
		this.getNoticeList();
	}
});
