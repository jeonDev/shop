const productReviewComponent = Vue.component('product-review-form', {
	props: ["productId"],
	template: `
		<div id="review-content">
			<div class="w-75 mx-auto border p-3">
				<!-- 리뷰 종류 선택 -->
				<div>
					<select-box :obj="obj" @input="value => reviewType = value"/> 
				</div>
				<div v-if="reviewList.length > 0">
					<!-- 평균 별점 표시 -->
					<div class="d-flex justify-content-end p-3">
						<span>
							<h4>{{reviewScope.SCOPE_AVG}} / 5</h4>
						</span>
						<span class="star-bar">
							<span v-bind:style="{width: reviewScope.SCOPE_PER + '%'}"/>
						</span>
					</div>
					<!-- 리스트 -->
					<div>
						<div class="border mt-2" v-for="(item, idx) in reviewList">
							<div class="d-flex justify-content-start p-3">
								<h3 class="d-inline-block">
									{{ item.USR_NM }}
								</h3>
								<span class="star-bar">
									<span v-bind:style="{width: item.SCOPE_PER + '%'}"/>
								</span>
								<h4 class="d-inline-block">
									({{ item.SCOPE }} / 5)
								</h4>
							</div>
							<div class="p-3" v-html="item.TITLE">
								
							</div>
							<div class="p-3" v-if="item.REVIEW_TYPE='PR002'">
								<img class="img-rounded w-25" :src="img" v-for="img in reviewImgs(item.FILE_SRC, item.FILE_REAL_NM)"/>
							</div>
							<!--
							<div class="p-3">
								{{item.CONTENT}}
							</div>
							-->
						</div>
						<br/><br/>
					</div>
					<!-- 페이징 -->
					<div>
						<!-- Pagenation -->
						<pagenation-form :obj="page" @pageMove="pageMove"></pagenation-form>
					</div>
				</div>
				<div class="w-100 text-center mt-5 mb-5" v-else>
					<h2>등록된 상품 후기가 없습니다.</h2>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			reviewList: [],			// PR001: 일반 후기 / PR002 : 상품 사진 후기 / PR003 : 익명 후기
			reviewScope: {},		// 상품 후기 별점
			obj: {					// select Option
				id: "review-type",
				name: "review-type",
				class: "form-control",
				allView: false,
				allViewNm: "",
				selected: "",
				options: []
			},
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 10,	// 한 페이지 출력 건 수
				blockUnit: 5,	// 한 페이지 출력 페이지 수
			},
			reviewType: "PR001"
		}
	},
	watch: {
		reviewType() {
			this.page.curPage = 1;
			this.getReviewList();
		}
	},
	methods : {
		// 이미지 split 처리
		reviewImgs(imgSrc, imgNm){
			
			if(!imgNm) return false;
			
			let fileNm = imgNm.split(' ');
			
			for(var i in fileNm){
				fileNm[i] = server + imgSrc + fileNm[i];
			}
			
			return fileNm;
		},
		// 리뷰 select 박스 세팅
		getReviewTypeInfo(){
			let data = {"cmn_type" : "REVIEW_TYPE"};
			
			httpRequest({
				url: "get/code/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.obj.options = rs.data;
				$('#review-type option:eq(0)').prop("selected",true);
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 상품 리뷰 조회
		getReviewList(){
			let reviewType = this.reviewType == "" ? "PR001" : this.reviewType;
			let curPage = this.page.curPage;
			let pageUnit = this.page.pageUnit;
			let blockUnit = this.page.blockUnit;
			let data = {"review_type" : reviewType
					, "product_id" : this.productId
					, "curPage" : curPage
					, "pageUnit" : pageUnit
					, "blockUnit" : blockUnit};
			
			httpRequest({
				url: "product/review/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.reviewList = rs.data.reviewList;
				this.page = rs.data.page;
				this.reviewScope = rs.data.reviewScope;
				
				$.each(this.reviewList, function(idx, item){
					item.TITLE = item.TITLE.replace(/(?:\r\n|\r|\n)/g, '<br />');
				});
			})
			.catch((error) => {
				console.log(error);
			});
		},
		pageMove(page){
			if(page == this.page.curPage) return false;
			this.page.curPage = page;
			this.getReviewList();
			
			moveAnimate("review-content");
		}
	},
	created() {
		this.getReviewTypeInfo();
		this.getReviewList();
	}
});