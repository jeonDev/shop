const noticeDetailComponent = Vue.component('notice-detail-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>공지사항</h2>
			</div>
			<!-- 게시글 내용 -->
			<div class="border mb-5">
				<div class="row m-2 p-2 border">
					<div class="col-sm-2 font-weight-bold">
						제목
					</div>
					<div class="col-sm-10">
						{{ bbsInfo.TITLE }}
					</div>
				</div>
				<div class="row m-2 p-2 border">
					<div class="col-sm-2 font-weight-bold">
						작성자
					</div>
					<div class="col-sm-10">
						{{ bbsInfo.USR_NM }}
					</div>
				</div>
				<div class="row m-2 p-2 border">
					<div class="col-sm-2 font-weight-bold">
						작성일자
					</div>
					<div class="col-sm-10">
						{{ bbsInfo.SYS_ENR_DTTM }}
					</div>
				</div>
				<div class="row m-2 p-2">
					<div class="col-sm-12"
						v-html="bbsInfo.CONTENT">
					</div>
				</div>
			</div>
			<div class="d-flex justify-content-center">
				<button type="button" class="btn btn-dark"
					@click="goNoticeList">목록으로</button>
			</div>
		</div>
	`,
	data(){
		return{
			bbsInfo : {},
			bbsNo : ""
		}
	},
	methods : {
		// 게시글 조회
		getBbsList(){
			let bbsNo = this.bbsNo;
			
			if(!bbsNo) return false;
			
			httpRequest({
				url: "board/" + bbsNo,
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				this.bbsInfo = rs.data.bbsInfo;
				this.viewCount();
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 조회수 증가
		viewCount(){
			let bbsNo = this.bbsNo;
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
		},
		goNoticeList(){
			this.$router.push({ name: "notice-form"});
		}
	},
	created() {
		this.bbsNo = this.$route.params.bbsNo;
		this.getBbsList();
	}
});
