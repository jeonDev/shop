Vue.component('main-product-review', {
	template: `
		<div>
			<div class="d-flex">
				<div class="p-2">
					<h4>인기 상품 후기</h4>
				</div>
			</div>
			<hr class="mt-0">
			<div>
				<div v-for="(item, idx) in reviewList">
					<div class="text-secondary">({{item.REVIEW_TYPE_NM}})</div>
					<div class="d-flex justify-content-start p-2">
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
					<div class="pl-3 text-secondary" style="font-size:12px">
						Size : {{item.PRODUCT_SIZE}}
					</div>
					<div class="p-2">
						<img class="img-rounded w-25" :src="img" v-for="img in reviewImgs(item.FILE_SRC, item.FILE_REAL_NM)" v-if="item.REVIEW_TYPE == 'PR002'"/>
						<div class="p-1" v-html="item.TITLE"></div>
					</div>
					<div class="p-3">
						<span>
							<button class="btn btn-outline-dark" @click="reviewGoods(item.REVIEW_NO)">
								좋아요({{item.GOODS_CNT}})
							</button>
						</span>
						<span>
							<router-link class="btn btn-outline-dark"
								:to="{ name: 'product-detail-form', params: { productId: item.PRODUCT_ID }}">상품 보러가기</router-link>
						</span>
					</div>
					<hr class="mt-0"/>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			reviewList : [],
			page: {
				curPage: 1,	// 현재페이지
				pageUnit: 3	// 한 페이지 출력 건 수
			}
		}
	},
	methods : {
		getProductReviewList(){
			let pageUnit = this.page.pageUnit;
			let data = {"pageUnit" : pageUnit
					, "mainYn" : "Y"};
					
			httpRequest({
				url: "product/review/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				console.log(rs)
				this.reviewList = rs.data.reviewList;
				this.page = rs.data.page;
//				this.reviewScope = rs.data.reviewScope;
				
				$.each(this.reviewList, function(idx, item){
					item.TITLE = item.TITLE.replace(/(?:\r\n|\r|\n)/g, '<br />');
				});
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 이미지 split 처리
		reviewImgs(imgSrc, imgNm){
			
			if(!imgNm) return false;
			
			let fileNm = imgNm.split(' ');
			
			for(var i in fileNm){
				fileNm[i] = server + imgSrc + fileNm[i];
			}
			
			return fileNm;
		},
		reviewGoods(reviewNo){
			
			httpRequest({
				url: "user/product/review/chk/" + reviewNo,
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				
				let code = rs.data.code;
				let message = rs.data.message;
			
				if(!confirm(message)) return false;
			
				let url = "";
				if(code == "0000"){
					url = "user/product/review/delete/" + reviewNo;
				} else {
					url = "user/product/review/insert/" + reviewNo;
				}
				
				this.reviewStateUpdate(url);
			})
			.catch((error) => {
				alert(error.data.message);
			});
			
		},
		reviewStateUpdate(url){
			httpRequest({
				url: url,
				method: "POST",
				responseType: "json"
			})
			.then((rs) => {
				this.getProductReviewList();
				alert(rs.data.message);
			})
			.catch((error) => {
				alert(error.data.message);
			});
		}
	},
	created() {
		this.getProductReviewList();
	}
});