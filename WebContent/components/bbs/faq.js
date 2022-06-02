const faqComponent = Vue.component('faq-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>자주묻는질문</h2>
			</div>
			<div id="faq-list">
				<!-- 리스트 조회 -->
				<div v-if="faqList.length > 0">
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
							<tbody v-for="(item, idx) in faqList">
								<tr @click="viewContent" :data-index="idx" :data-bbsNo="item.BBS_NO">
									<td class="text-center">{{page.count - item.RN + 1}}</td>
									<td>{{item.TITLE}}</td>
									<td class="text-center">{{item.USR_NM}}</td>
									<td class="text-center">{{item.VIEW_CNT}}</td>
									<td class="text-center">{{item.SYS_ENR_DTTM}}</td>
								</tr>
								<tr class="display-none" :id="'faq' + idx">
									<td colspan="5" v-html="item.CONTENT"></td>
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
			faqList: [],
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			}
		}
	},
	watch: {
		$route(){
			this.page.curPage = this.$route.query.curPage;
			this.getFaqList();
		}
	},
	methods : {
		// 공지사항 조회
		getFaqList(){
			
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			let blockUnit = this.page.blockUnit;
			let title = this.title;
			
			let data = {"bbs_type" : "FAQ"
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
				this.faqList = rs.data.bbsList;
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

			moveAnimate("faq-list");
		},
		viewContent(e){
			let idx = e.currentTarget.dataset.index;
			let viewChk = $('#faq' + idx).css('display') == "table-row";
			
			$('#faq' + idx).toggle(500);
			
			if(!viewChk){
				let bbsNo = e.currentTarget.dataset.bbsno;
				this.viewCount(bbsNo);
			}
		},
		// 조회수 증가
		viewCount(bbsNo){
			
			let data = {"bbs_no" : bbsNo
					, "view_cnt" : 1};
			
			httpRequest({
				url: "board/update",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				
			})
			.catch((error) => {
				console.log(error);
			});
		}
	},
	created() {
		this.page.curPage = this.$route.query.curPage;
		this.getFaqList();
	}
});
