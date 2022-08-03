const adminProductManageComponent = Vue.component('admin-product-form', {
	template: `
		<div class="container">
			<div class="mb-5">
				<h2>상품 관리</h2>
			</div>
			
			<!-- excel Upload 버튼 -->
			<div class="d-flex justify-content-end">
				<div class="p-2">
					<input type="file" id="excel-file-upload" class="display-none" @input="excelUpload"/>
					<label for="excel-file-upload" class="btn btn-dark m-0">Excel 등록</label>
				</div>
			</div>
				
			<div id="admin-product-manage" class="border p-3 mb-5">
				
				<div class="row mb-2">
					<div class="col-sm-2 font-weight-bold text-right">
						상품명
					</div>
					<div class="col-sm-10">
						<input type="text" id="product-name" class="form-control" v-model="productInfo.PRODUCT_NAME"/>
					</div>
				</div>
				
				<div class="row mb-2">
					<div class="col-sm-2 font-weight-bold text-right">
						가격
					</div>
					<div class="col-sm-10">
						<input type="text" id="price" class="form-control" v-model="productInfo.PRICE"/>
					</div>
				</div>
				
				<div class="row mb-2">
					<div class="col-sm-2 font-weight-bold text-right">
						상품구분
					</div>
					<div class="col-sm-4">
						<select-box :obj="productTypeObj" 
							@input="value => productInfo.PRODUCT_TYPE = value"/>
					</div>
					
					<div class="col-sm-2 font-weight-bold text-right">
						상품상태
					</div>
					<div class="col-sm-4">
						<select-box :obj="productStateObj" 
							@input="value => productInfo.PRODUCT_STATE = value"/>
					</div>
				</div>
				
				<div class="row mb-2">
					<div class="col-sm-2 font-weight-bold text-right">
						상품 사이즈
					</div>
					<div class="col-sm-4">
						<span>
							<select-box :obj="sizeObj" @input="viewProductSize"/>
						</span>
					</div>
					
					<div class="col-sm-2 font-weight-bold text-right">
						<span v-if="productId != 'create'">상품 갯수</span>
						<span v-else>사이즈 추가</span>
					</div>
					<div class="col-sm-4 d-flex justify-content-between" v-if="productId != 'create'">
						<span class="text-secondary">
							{{ Number(productCnt).toLocaleString('ko-KR') }}개
						</span>
						<span>
							<button class="btn btn-dark"
								@click="changeProductSize">사이즈 및 재고 관리</button>
						</span>
					</div>
					<div class="col-sm-4 d-flex justify-content-between" v-else>
						<span>
							<input type="text" id="new-product-size" class="form-control" placeholder="사이즈 정보 입력"/>
						</span>
						<span>
							<button class="btn btn-dark"
								@click="addProductSize">추가</button>
							<button class="btn btn-dark"
								@click="deleteProductSize">삭제</button>
						</span>
					</div>
				</div>
				
				<div class="row mb-2" v-if="productId != 'create'">
					<div class="col-sm-2 font-weight-bold text-right">
						삭제 여부
					</div>
					<div class="col-sm-10">
						<input type="radio" id="del-n" name="del_yn" class="label-checkbox" v-model="productInfo.DEL_YN" value="N"/>
						<label for="del-n">등록</label>
						<input type="radio" id="del-y" name="del_yn" class="label-checkbox" v-model="productInfo.DEL_YN" value="Y"/>
						<label for="del-n">삭제</label>
					</div>
				</div>
				
				<div class="row mb-2">
					<div class="col-sm-2 font-weight-bold text-right">
						상품 이미지
					</div>
					<div class="col-sm-10">
						<file-upload 
							:files="imgList" 
							:extChk="2"
							:views="'img'"
							@uploadFileInfo="uploadFile"
							@deleteFileInfo="deleteFile"/>
					</div>
				</div>
				
				<div class="row mb-2">
					<div class="col-sm-2 font-weight-bold text-right">
						상품 설명
					</div>
					<div class="col-sm-10">
						<div id="smarteditor">
							<textarea id="content" class="w-100" rows="10" cols="10"></textarea>
						</div>
					</div>
				</div>
				
			</div>
			
			<div class="w-100 text-center">
				<button class="btn btn-dark"
					@click="save">저장</button>
			</div>
			
		</div>
	`,
	data(){
		return{
			productInfo: {
				FILE_REAL_NM : "",
				FILE_ID : "",
				PRODUCT_STATE : "",
				PRODUCT_TYPE : "",
				PRODUCT_DETAIL : ""
			},
			productId: "",
			productCnt: "",
			deleteFileList: [],
			uploadFileList: [],
			sizeObj: {					// product Size Select box
				id: "product-size",
				name: "product-size",
				class: "form-control",
				allView: false,
				allViewNm: "",
				selected: "",
				options: []
			},
			productStateObj: {			// product State Select box
				id: "product-state",
				name: "product-state",
				class: "form-control",
				allView: true,
				allViewNm: "선택",
				selected: "",
				options: []
			},
			productTypeObj: {			// product Type Select box
				id: "product-type",
				name: "product-type",
				class: "form-control",
				allView: true,
				allViewNm: "선택",
				selected: "",
				options: []
			}
		}
	},
	computed: {
		// 이미지 리스트
		imgList(){
			let data = new Array();
			
			if(!this.productInfo.FILE_REAL_NM) return data;
			
			let fileSrcs = this.productInfo.FILE_REAL_NM.split(' ');
			let fileIds = this.productInfo.FILE_ID.split(' ');
			
			for(var i in fileSrcs){
				
				let fileId = fileIds[i];
				let fileSrc = fileSrcs[i];
				if(fileId){
					fileSrc = server + this.productInfo.FILE_SRC + fileSrc;
				}
				
				data.push({
					"file_id" : fileId,
					"file_src" : fileSrc
				})
			}
			
			return data;
		}
	},
	methods : {
		// PRODUCT_STATE
		getProductStateMenuList(){
			let data = {"cmn_type" : "PRODUCT_STATE"};
			
			httpRequest({
				url: "get/code/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.productStateObj.options = rs.data;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// PRODUCT_TYPE
		getProductTypeMenuList(){
			
			httpRequest({
				url: "product/category/list",
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				
				let array = [];
				let categoryList = rs.data.categoryList;
				
				$.each(categoryList, function(idx, item){
					if(idx !== 0){
						array.push({
							"CMN_CD" : item.TYPE_CD,
							"CMN_NM" : item.TYPE_NM
						});
					}
				})
				
				this.productTypeObj.options = array;
				
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 상품 정보 조회
		async getProductDetail(){
			
			await httpRequest({
				url: "product/" + this.productId,
				method: "GET",
				responseType: "json"
			})
			.then((rs) => {
				this.productInfo = rs.data.productInfo;
				
				// Smart Editor
				smartEditor(this.productInfo.PRODUCT_DETAIL);
				
				// select 박스 Product Size
				let options = [];
				let selected = "";
				let productSizes = this.productInfo.PRODUCT_SIZE.split(' ');
				let productNo = this.productInfo.PRODUCT_NO.split(' ');
				
				$.each(productSizes, function(idx, item){
					
					let option = {CMN_CD: productNo[idx], CMN_NM: item};
					
					if(idx == 0) selected = productNo[idx];
					
					options.push(option);
				});
				
				this.sizeObj.options = options;
				this.sizeObj.selected = selected;
				this.viewProductSize(selected);
				
				this.productStateObj.selected = this.productInfo.PRODUCT_STATE;
				this.productTypeObj.selected = this.productInfo.PRODUCT_TYPE;
			})
			.catch((error) => {
				console.log(error);
			});
		},
		// 사이즈 별 재고량 조회
		viewProductSize(v){
			
			if(this.productId == 'create') return false;
			
			let productNos = this.productInfo.PRODUCT_NO.split(' ');
			let productCnts = this.productInfo.PRODUCT_CNT.split(' ');
			let productCnt;
			
			$.each(productNos, function(idx, item){
				if(item == v) {
					productCnt = productCnts[idx];
				}
			});
			
			this.productCnt = productCnt;
		},
		formChk(){
			let productName = this.productInfo.PRODUCT_NAME;	// 상품명
			let price = this.productInfo.PRICE;					// 가격
			let productType = this.productInfo.PRODUCT_TYPE;	// 상품구분
			let productState = this.productInfo.PRODUCT_STATE;	// 상품상태
			let productDetail = this.saveEditor();				// 상품설명 (Smart Editor)
			
			if(!productName) {
				alert("상품명을 입력해주세요.");
				$('#product-name').focus();
				return false;
			} else if(isNaN(price)) {
				alert("상품 가격을 입력해주세요.");
				$('#price').focus();
				return false;
			} else if(!productType) {
				alert("상품 구분을 입력해주세요.");
				$('#product-type').focus();
				return false;
			} else if(!productState) {
				alert("상품 상태를 입력해주세요.");
				$('#product-state').focus();
				return false;
			} else if(!productDetail){
				alert("상품 설명을 입력해주세요.");
				$('#content').focus();
				return false;
			}
			
			let data = {
					'product_name' : productName,
					'price' : price,
					'product_type' : productType,
					'product_state' : productState,
					'product_detail' : productDetail
			}
			
			return data;
		},
		// 저장
		save(){
			let uploadFile = this.uploadFileList;	// 업로드 파일
			let deleteFile = this.deleteFileList;	// 삭제 파일
			let delYn = this.productInfo.DEL_YN;
			let data = this.formChk();
			
			if( !data ) return false;
			
			if(!confirm("저장하시겠습니까?")) return false;
			
			let formData = new FormData();
			
			// Upload File
			$.each(uploadFile, function(idx, item){
				formData.append("files", item);
			});
			
			// Delete File
			if(deleteFile){
				data.file_id = deleteFile;
			}
			
			if(delYn) data.del_yn = delYn;
			
			// 신규 상품 시, 사이즈 추가
			if(this.productId == 'create'){
				
				let productSize = [];
				
				$.each(this.sizeObj.options, function(idx, item){
					productSize.push(item.CMN_CD);
				});

				data.product_size = productSize;
			}
			
			formData.append("param", new Blob([JSON.stringify(data)], {type: "application/json"}));
			
			let url = "admin/product/";
			url += this.productId == 'create' ? 'create' : 'update/' + this.productId;
			
			httpRequest({
				url: url,
				method: "POST",
				processData: false,
				contentType: false,
				header: {"Content-Type" : "multipart/form-data"},
				data: formData
			})
			.then((rs) => {
				alert(rs.data.message);
				
				let productId = rs.data.productId;
				$(location).attr('href', '/shop/admin/product/manage/' + productId);
			})
			.catch((error) => {
				console.log(error);
				alert(error.data.message);
			});
		},
		// 상품 사이즈 관리 페이지로 이동
		changeProductSize(){
			this.$router.push({name: "admin-product-size-form", params:{productId: this.productId}});
		},
		// 신규 등록 시, 상품 사이즈 추가
		addProductSize(){
			let value = $('#new-product-size').val();
			
			this.sizeObj.options.push({
				'CMN_CD' : value,
				'CMN_NM' : value
			});
			
			$('#new-product-size').val("");
			$('#product-size').val("");
		},
		// 신규 등록 시, 사이즈 정보 삭제
		deleteProductSize(){
			let value = $('#new-product-size').val();
			
			let idx = -1;
			
			$.each(this.sizeObj.options, function(i, item){
				if(item.CMN_CD == value) idx = i;
			});
			
			if(idx > 0) this.sizeObj.options.splice(idx, 1);
		},
		// 파일 변경 시, 기존 정보 최신화
		changeFileInfo(fileIds, fileRealNms){
			let FILE_ID = "";
			let FILE_REAL_NM = "";
			
			for(let i = 0; i < fileRealNms.length; i++){
				
				if(i !== 0){
					FILE_ID += " " + fileIds[i];
					FILE_REAL_NM += " " +fileRealNms[i];
				} else {
					FILE_ID += fileIds[i];
					FILE_REAL_NM += fileRealNms[i];
				}
			};
			
			this.productInfo.FILE_ID = FILE_ID;
			this.productInfo.FILE_REAL_NM = FILE_REAL_NM;
		},
		// 파일 업로드
		uploadFile(obj){
			
			let fileIds = [];
			let fileRealNms = [];
			
			if(this.productInfo.FILE_REAL_NM) {
				fileIds = this.productInfo.FILE_ID.split(' ');
				fileRealNms = this.productInfo.FILE_REAL_NM.split(' ');
			} else {
				this.productInfo.FILE_ID = "";
				this.productInfo.FILE_REAL_NM = "";
			}
			
			fileRealNms.push(obj.file_src);
			fileIds.push(" ");
			
			this.changeFileInfo(fileIds, fileRealNms);
			
			this.uploadFileList.push(obj.file);
		},
		// 파일 삭제
		deleteFile(v){
			
			let fileId = v.file_id;
			let fileIds = this.productInfo.FILE_ID.split(' ');
			let fileRealNms = this.productInfo.FILE_REAL_NM.split(' ');
			
			let idx = fileIds.indexOf(fileId);
			
			fileIds.splice(idx, 1);
			fileRealNms.splice(idx, 1);
			
			this.changeFileInfo(fileIds, fileRealNms);
			
			// 기존 파일 제거
			if( fileId ) {
				this.deleteFileList.push(fileId);
			// 추가된 파일 제거
			} else {
				
				let file = v.file;
				let fileIdx = this.uploadFileList.indexOf(file);
				
				this.uploadFileList.splice(fileIdx, 1);
			}
		},
		// editor 저장
		saveEditor(){
			let content = saveEditor("content");
			
			return content;
		},
		excelUpload(e){
			let file 	 = e.target.files;
			
			let extImgs = ['xlsx'];
			
			let fileName = file[0].name;
			let fileDot = fileName.lastIndexOf(".");
			let fileExt = fileName.substring(fileDot + 1, fileName.length).toLowerCase();
			
			if(!extImgs.includes(fileExt)){
				alert("Excel 파일만 등록가능합니다.");
				return false;
			}
			
			let formData = new FormData();
			
			formData.append("file", file[0]);
			
			httpRequest({
				url: "admin/product/create/excel",
				method: "POST",
				processData: false,
				contentType: false,
				header: {"Content-Type" : "multipart/form-data"},
				data: formData
			})
			.then((rs) => {
				alert(rs.data.message);
			})
			.catch((error) => {
				console.log(error);
				alert(error.data.message);
			});
			
		},
		async init(){
			this.productId = this.$route.params.productId;
			if(this.productId !== 'create'){
				await this.getProductDetail();
			}
			this.getProductStateMenuList();
			this.getProductTypeMenuList();
		}
	},
	created() {
		this.init();
	},
	mounted() {
		if(this.productId === 'create'){
			// Smart Editor
			smartEditor("");
		}
	}
});
