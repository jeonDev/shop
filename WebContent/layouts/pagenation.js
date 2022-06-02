Vue.component('pagenation-form', {
	props : [ "obj" ],
	template: `
		<div class="container mt-5">
				<div class="row">
					<div class="col">
						<ul class="pagination justify-content-center">
							<li class="page-item" v-if="previousButtonDisabled">
								<button type="button" class="page-link"
								@click="previousMove">
									이전
								</button>
							</li>
							<li class="page-item" :class="{ 'active' : obj.curPage == pageNumber  }" v-for="pageNumber in pageList">
								<button type="button" class="page-link"
								@click="pageMove(pageNumber)">
									{{pageNumber}}
								</button>
							</li>
							<li class="page-item" v-if="nextButtonDisabled">
								<button type="button" class="page-link"
								@click="nextMove">
									다음
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
	`,
	computed: {
		// 총 페이지가 5개 이하 : 이전/다음 버튼 X
		buttonDisplay: function(){
			return this.obj.count > this.obj.blockCount;
		},
		// 마지막 페이지 번호
		lastPageNumber: function(){
			let lastNumber = this.obj.end;
			if(lastNumber > ( this.obj.count / this.obj.pageUnit)) return this.obj.count;
		},
		// 페이지 리스트
		pageList: function(){
			if(this.obj.count < 1) return false;
			
			let data = [];
			
			for(let i = this.obj.startBlock; i <= this.obj.endBlock; i++){
				data.push(i);
			}
			return data;
		},
		// 다음 버튼 비활성화 조건
		nextButtonDisabled: function(){
			return this.obj.blockCount > this.obj.endBlock;
		},
		// 이전 버튼 비활성화 조건
		previousButtonDisabled: function(){
			return this.obj.curBlock != 0;
		}
	},
	methods : {
		// 페이지 이동
		pageMove(page) {
			/*
			if(page == this.obj.curPage) return false;
			
			let query = Object.assign({}, this.$route.query);
			query.curPage = page;
			this.$router.push({ query });
			*/
			// 필요 시, 상위 컴포넌트에서 이벤트 추가
			this.$emit('pageMove', page);
		},
		// 이전페이지 이동(블럭 단위)
		previousMove(){
			this.pageMove(this.obj.curBlock * this.obj.blockUnit);
		},
		// 다음페이지 이동(블럭 단위)
		nextMove(){
			this.pageMove( (this.obj.curBlock + 1) * this.obj.blockUnit + 1);
		}
	}
});

/*
# 입력
obj : {
	curPage : '',					// id 속성
	totCount : '',					// name 속성
	
}

@input="value => Object = value"
or
watch: {
	$route() {
		this.page.curPage = this.$route.query.curPage;
		+ 추가 기능.
	}
}
 */