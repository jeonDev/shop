const adminStatisticsComponent = Vue.component('admin-statistics-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>상품 판매 통계</h2>
			</div>
			<div class="border p-2">
				
				<!-- 카테고리별 판매량(판매금액)-->
				<div class="mb-5">
					<div class="p-4">
						<h2>① 카테고리별 판매량(판매금액)</h2>
					</div>
					<div>
						<table class="table table-bordered text-center">
							<thead>
								<tr>
									<th></th>
									<th v-for="(item, idx) in categoryList">
										{{item.TYPE_NM}}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="font-weight-bold">판매량</td>
									<td v-for="(item, idx) in categoryList">
										{{item.CNT.toLocaleString('ko-KR')}}
									</td>
								</tr>
								<tr>
									<td class="font-weight-bold">판매금액</td>
									<td v-for="(item, idx) in categoryList">
										{{item.BUY_PRICE.toLocaleString('ko-KR')}}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				
				<!-- 월별 판매량(판매금액) -->
				<div class="mb-5">
					<div class="p-4">
						<h2>② 월별 판매량(판매금액)</h2>
					</div>
					<div>
						<table class="table table-bordered text-center">
							<thead>
								<th></th>
								<th v-for="(item, idx) in monthList">
									{{item.DTTM}}
								</th>
							</thead>
							<tbody>
								<tr>
									<td class="font-weight-bold">판매량</td>
									<td v-for="(item, idx) in monthList">
										{{item.CNT.toLocaleString('ko-KR')}}
									</td>
								</tr>
								<tr>
									<td class="font-weight-bold">판매금액</td>
									<td v-for="(item, idx) in monthList">
										{{item.BUY_PRICE.toLocaleString('ko-KR')}}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				
				<!-- 성별 -->
				<div class="mb-5">
					<div class="p-4">
						<h2>③ 사용자 성별 판매량</h2>
					</div>
					<div>
						<table class="table table-bordered text-center">
							<colgroup>
								<col width="10%"/>
								<col width="45%"/>
								<col width="45%"/>
							</colgroup>
							<thead>
								<tr>
									<th></th>
									<th v-for="(item, idx) in sexList">
										{{item.SEX_NM}}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="font-weight-bold">판매량</td>
									<td v-for="(item, idx) in sexList">
										{{item.CNT.toLocaleString('ko-KR')}}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	`,
	data(){
		return{
			categoryList : [],
			monthList : [],
			sexList : []
		}
	},
	methods : {
		getStatistics(){
			httpRequest({
				url: "admin/product/sales/cnt",
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				this.categoryList = rs.data.categoryList;
				this.monthList 	  = rs.data.monthList;
				this.sexList	  = rs.data.sexList;
			})
			.catch((error) => {
				console.log(error);
			});
		}
	},
	created() {
		this.getStatistics();
	}
});
