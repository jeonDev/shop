const indexComponent = Vue.component('index-form', {
	template: `
		<div class="container">
			<div class="row">
				<div>
					<!-- 대표 상품 -->
					<main-product></main-product>
				</div>
			</div>
			<div class="row mb-3 mt-5">
				<div class="col-sm-6">
					<!-- 카테고리 검색 -->
					<main-category></main-category>
				</div>
				<div class="col-sm-6">
					<!-- 게시판 -->
					<main-bbs></main-bbs>
				</div>
			</div>
		</div>
	`
});
