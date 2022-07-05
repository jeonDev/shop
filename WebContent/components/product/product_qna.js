const productQnaComponent = Vue.component('product-qna-form', {
	props: ["productId"],
	template: `
		<div id="qna-content">
			<div class="w-75 mx-auto border p-3">
				<!-- 상품 문의 작성 -->
				<div class="border mb-3">
					<div class="d-flex p-3">
						<div class="flex-fill">
							<input type="text" class="form-control" placeholder="문의사항을 작성해주세요."
								maxlength="300"
								v-model="qnaTitle">
						</div>
						<div>
							<button type="button" class="btn btn-success" @click="qnaWrite">작성</button>
						</div>
					</div>
				</div>
				<div v-if="qnaList.length > 0">
					<!-- 리스트 -->
					<div>
						<table class="table table-bordered">
							<colgroup>
								<col width="10px">
								<col width="35%">
							</colgroup>
							<thead>
								<tr class="text-center">
									<th>No</th>
									<th>제목</th>
									<th>답변여부</th>
									<th>작성자</th>
									<th>작성일자</th>
								</tr>
							</thead>
							<tbody v-for="(item, idx) in qnaList">
								<tr @click="viewCommnet" :data-index="idx">
									<td class="text-center">{{page.count - item.RN + 1}}</td>
									<td>{{item.TITLE}}</td>
									<td class="text-center">{{item.WRT_STATE_NM}}</td>
									<td class="text-center">{{item.USR_NM}}</td>
									<td class="text-center">{{item.SYS_ENR_DTTM}}</td>
								</tr>
								<tr class="display-none" v-if="item.WRT_STATE == '40'" :id="'comment' + idx">
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
				<div class="w-100 text-center mt-5 mb-5" v-else>
					<h2>등록된 상품 문의가 없습니다.</h2>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			qnaList: [],
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			},
			qnaTitle : ""	// 상품 문의
		}
	},
	methods : {
		// 상품 QnA 조회
		getQnaList(){
			
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			let blockUnit = this.page.blockUnit;
			
			let data = {"bbs_type" : "PRODUCT_QNA"
					, "product_id" : this.productId
					, "curPage" : curPage
					, "pageUnit" : pageUnit
					, "blockUnit" : blockUnit};
			
			httpRequest({
				url: "board/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.qnaList = rs.data.bbsList;
				this.page = rs.data.page;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		pageMove(page){
			if(page == this.page.curPage) return false;
			this.page.curPage = page;
			this.getQnaList();
			
			let offset = $("#review-content").offset(); //해당 위치 반환
			$("html, body").animate({scrollTop: offset.top},400); // 선택한 위치로 이동. 두번째 인자는 0.4초를 의미한다.
		},
		// 답변 보기
		viewCommnet(e){
			let idx = e.currentTarget.dataset.index;
			$('#comment' + idx).toggle(500);
		},
		// qna 작성
		qnaWrite(){
			let qnaTitle = this.qnaTitle;
			
			if(!qnaTitle){
				alert("내용을 입력해주세요.");
				return false;
			}
			
			if(!confirm("게시글을 작성하시겠습니까?")) return false;
			
			let data = {"title" : qnaTitle
					, "product_id" : this.productId
					, "bbs_type" : "PRODUCT_QNA"
					, "wrt_state" : "30"};
			
			httpRequest({
				url: "user/board/create",
				method: "POST",
				responseType: "json",
				data: data
			})
			.then((rs) => {
				alert(rs.data.message);
				this.getQnaList();
				this.qnaTitle = "";
			})
			.catch((error) => {
				alert(error.data.message);
			});
		}
	},
	created() {
		this.getQnaList();
	}
});