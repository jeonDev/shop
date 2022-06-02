const mypageComponent = Vue.component('mypage-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>마이페이지</h2>
			</div>
			<div class="mb-4">
			
				<!-- 버튼 선택 -->
				<div id="mypage-detail-btn" role="group" aria-label="..." class="btn-group d-flex w-100" style="height: 60px;">
					<button type="button" data-view="1" class="btn btn-light w-100 active"
						@click="changeView($event)">
						주문내역조회
					</button>
					<button type="button" data-view="2" class="btn btn-light w-100"
						@click="changeView($event)">
						개인정보변경
					</button>
				</div>
				
				<!-- 보여질 부분 -->
				<div id="mypage-detail-view" class="border p-3">
					<!-- 주문내역 조회 -->
					<div id="detail-1" class="viewer_cont detail-view">
						<mypage-order-form/>
					</div>
					
					<!-- 개인정보 변경 -->
					<div id="detail-2" class="detail-view display-none">
						<mypage-member-info-form/>
					</div>
					
				</div>
				
				<div>
				
				</div>
			</div>
		</div>
	`,
	data() {
		return {
			mypageClass : "buy"
		}
	},
	computed: {

	},
	methods: {
		// 뷰 내용 변경
		changeView(e){
			$('#mypage-detail-btn button').removeClass('active');
			e.currentTarget.classList.add('active');
			
			let view = e.currentTarget.dataset.view;
			$('#mypage-detail-view .detail-view').addClass("display-none");
			$('#detail-' + view).removeClass("display-none");
		}
	},
	created() {
		
	}
});