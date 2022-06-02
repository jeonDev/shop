const productReviewWriteComponent = Vue.component('product-review-write-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>상품 후기 등록</h2>
			</div>
			<div class="border p-3">
				<!-- 리뷰 종류 선택 -->
				<div class="mb-3">
					<select-box :obj="obj" @input="value => reviewType = value"/> 
				</div>
				
				<!-- 등록한 리뷰 조회 -->
				<div v-if="reviewInfo">
					<!-- 별점 표시 -->
					<div class="d-flex justify-content-start p-3 mb-3">
						<span class="star-bar">
							<span v-bind:style="{width: reviewInfo.SCOPE_PER + '%'}"/>
						</span>
						<span>
							<h4>{{reviewInfo.SCOPE}} / 5</h4>
						</span>
					</div>
					
					<div class="mb3" id="title-view">
						<span class="font-weight-bold">상품에 대한 평가를 20자 이상 작성해 주세요.</span>
						<textarea class="form-control w-100 bg-white" rows="5" v-model="reviewInfo.TITLE" readonly></textarea>
					</div>
					
					<!-- 이미지 -->
					<div class="mb-3 p-3" v-if="reviewType == 'PR002'">
							<img class="img-rounded w-25" :src="img" v-for="img in reviewImgs(reviewInfo.FILE_SRC, reviewInfo.FILE_REAL_NM)"/>
					</div>
				</div>
				
				<!-- 리뷰 입력 -->
				<div v-else>
				
					<!-- 별점 입력 -->
					<div class="mb-3" id="scope-view">
						<span class="font-weight-bold">별점을 매겨주세요.</span>
						<scope-star :scope="writeReviewInfo.scope" @input="value => writeReviewInfo.scope = value"/>
					</div>
					
					<!-- 후기 입력 -->
					<div class="mb-3" id="title-view">
						<span class="font-weight-bold">상품에 대한 평가를 20자 이상 작성해 주세요.</span>
						<textarea class="form-control w-100" rows="5" v-model="writeReviewInfo.title"></textarea>
						<div class="font-weight-bold w-100 text-right">{{ writeReviewInfo.title.length }} / 20자 이상</div>
					</div>
					
					<!-- 이미지 등록(PR002) -->
					<div class="mb-3" id="file-view" v-if="reviewType == 'PR002'">
						<file-upload 
							:files="writeReviewInfo.files" 
							:extChk="2"
							:views="'file'"
							@uploadFileInfo="uploadFile"
							@deleteFileInfo="deleteFile"/>
					</div>
					
					<!-- 입력하기 -->
					<div class="text-center">
						<button type="button" class="btn btn-dark"
										@click="writeReview">등록하기</button>
					</div>
				</div>
			</div>
		</div>
	`,
	watch: {
		reviewType() {
			this.writeReviewInfo.scope = 0;
			this.writeReviewInfo.title = "";
			this.writeReviewInfo.files = [];
			
			this.getReviewDetail();
		}
	},
	data(){
		return{
			paymentNo: "",			// 주문번호
			reviewInfo: [],			// PR001: 일반 후기 / PR002 : 상품 사진 후기 / PR003 : 익명 후기
			obj: {					// select Option
				id: "review-type",
				name: "review-type",
				class: "form-control",
				allView: false,
				allViewNm: "",
				selected: "",
				options: []
			},
			writeReviewInfo: {		// 작성 정보
				scope: 0,
				title: "",
				files: []
			},	
			reviewType: "PR001"
		}
	},
	methods : {
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
		getReviewDetail(){
			let reviewType = this.reviewType == "" ? "PR001" : this.reviewType;
			let paymentNo = this.paymentNo;
			let data = {"review_type" : reviewType,
					"payment_no" : paymentNo};
			
			httpRequest({
				url: "product/review/detail",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.reviewInfo = rs.data.reviewInfo;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 폼 체크
		formChk(){
			let title = this.writeReviewInfo.title;
			let scope = this.writeReviewInfo.scope;
			
			if( !(scope > 0 && scope <= 5) ){
				alert('별점을 매겨주세요.');
				$('#scope-view').focus();
				return false;
			} else if(title.length < 20){
				alert('후기는 20글자 이상 입력해야 합니다.');
				$('#title-view').focus();
				return false;
			}
			
			let reviewType = this.reviewType;
			
			if(reviewType == 'PR002'){
				
				let fileSize = this.writeReviewInfo.files.length;
				
				if( fileSize == 0){
					alert("상품 후기에 대한 이미지를 등록해주세요.");
					$('#file-view').focus();
				}
			}
			return true;
		},
		// 상품 후기 작성
		writeReview(){
			if(!this.formChk()) return false;
			
			if(!confirm("상품 리뷰를 작성하시겠습니까?")) return false;
			
			let paymentNo = this.paymentNo;
			let reviewType = this.reviewType;
			let scope = this.writeReviewInfo.scope;
			let title = this.writeReviewInfo.title;
			let files = this.writeReviewInfo.files;
			
			let data = {
					'payment_no' : paymentNo,
					'review_type' : reviewType,
					'scope'		 : scope,
					'title'		 : title
			}

			let formData = new FormData();
			
			$.each(files, function(idx, item){
				formData.append("files", item); 
			});
			
			formData.append("param", new Blob([JSON.stringify(data)], {type: "application/json"}));
			
			httpRequest({
				url: "user/product/review/create",
				method: "POST",
				processData: false,
				contentType: false,
				header: {"Content-Type" : "multipart/form-data"},
				data: formData
			})
			.then((rs) => {
				alert(rs.data.message);
				this.getReviewDetail();
			})
			.catch((error) => {
				console.log(error);
				alert(error.data.message);
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
		uploadFile(file){
			this.writeReviewInfo.files.push(file.file);
		},
		deleteFile(file){
			let idx = this.writeReviewInfo.files.indexOf(file);
			this.writeReviewInfo.files.splice(idx, 1);
		}
	},
	created() {
		this.paymentNo = this.$route.params.paymentNo;
		this.getReviewTypeInfo();
		this.getReviewDetail();
	}
});