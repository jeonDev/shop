Vue.component('main-bbs', {
	template: `
		<div>
			<div class="d-flex">
				<div class="p-2">
					<h4>게시판</h4>
				</div>
				<div class="ml-auto p-2">
					<span>
						<router-link :to="{ path: '/shop/notice' }" class="a">전체보기</router-link>
					</span>
				</div>
			</div>
			<hr class="mt-0">
			<div>
				<table class="table table-bordered">
					<tbody>
						<tr v-for="(item, idx) in noticeList"
							@click="noticeDetail(item.BBS_NO)">
							<td>{{item.TITLE}}</td>
							<td class="text-center">{{item.USR_NM}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
	data(){
		return{
			noticeList: [],
			page: {
				curPage: 1,		// 현재페이지
				pageUnit: 3,	// 한 페이지 출력 건 수
			}
		}
	},
	methods : {
		// 공지사항 조회
		getNoticeList(){
			
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			
			let data = {"bbs_type" : "NOTICE"
					, "curPage" : curPage
					, "pageUnit" : pageUnit};
			
			httpRequest({
				url: "board/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.noticeList = rs.data.bbsList;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		noticeDetail(bbsNo){
			this.$router.push({name: "notice-detail-form", params : { bbsNo : bbsNo } });
		}
	},
	created() {
		this.getNoticeList();
	}
});