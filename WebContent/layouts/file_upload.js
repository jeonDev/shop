const fileUploadComponent = Vue.component('file-upload', {
	props: ["files", "extChk", "views"],
	template: `
		<div class="border">
		
			<!-- File 등록 -->
			<div class="border p-1">
				<div class="p-3">
					<input type="file" id="file-upload" class="display-none" @change="updateFile" multiple/>
					<label for="file-upload" class="btn btn-dark m-0">파일 업로드</label>
				</div>
			</div>
			
			<!-- 등록된 파일 내역 표기 -->
			<div class="border p-1">
				<div v-if="views == 'file'">
					<div v-if="files.length > 0">
						<div v-for="(item, idx) in files">
							<span>
								{{item.name}}
							</span>
							<span>
								<i class="far fa-minus-square" :data-idx="idx" @click="deleteFile"></i>
							</span>
						</div>
					</div>
					<div class="text-center" v-else>
						<p>등록된 파일이 존재하지 않습니다.</p>
						<p>파일을 등록해주세요.</p>
					</div>
				</div>
				<div v-if="views == 'img'">
					<div class="d-flex" v-if="files.length > 0">
						<div v-for="(item, idx) in files" :style="{width: 100/files.length + '%'}">
							<div>
								<img :src="item.file_src" class="border w-100 h-100" style="max-height : 400px" 
									onerror="this.src='/shop/images/img_error.png'"/>
							</div>
							<div>
								<span>
									<i class="far fa-minus-square" :data-idx="idx" @click="deleteFile"></i>
								</span>
							</div>
						</div>
					</div>
					
					<div class="text-center" v-else>
						<p>등록된 이미지가 존재하지 않습니다.</p>
						<p>이미지를 등록해주세요.</p>
					</div>
				</div>
			</div>
		</div>
	`,
	methods : {
		updateFile(e){
				
				let file 	 = e.target.files;
				let maxSize  = 5;
				let fileSize = file.length;
				let extChk	 = this.extChk;
				
				let extImgs = ['gif', 'jpg', 'jpeg', 'png', 'bmp' ,'ico', 'apng'];
				
				for(let i = 0; i < fileSize; i++){
					
					// 이미지만 등록 가능
					if(extChk == '2') {
						
						let fileName = file[i].name;
						let fileDot = fileName.lastIndexOf(".");
						let fileExt = fileName.substring(fileDot + 1, fileName.length).toLowerCase();
						
						if(!extImgs.includes(fileExt)){
							alert("이미지만 등록가능합니다.");
							return false;
						}
					}
					
					// 최대 등록 건수 체크
					// TODO: 동기처리 해야지 maxSize 처리 가능!
					if(this.files.length < maxSize){
						this.readURL(file[i]);
					} else {
						alert("파일은 최대 " + maxSize + "개 까지만 등록 가능합니다.");
						return false;
					}
				};
				
		},
		// 비동기!
		async readURL(files) {
			
			if (files) {
				var reader = new FileReader();
				reader.onload = e => {
					let fileSrc = e.target.result;
					
					let obj = {
						'file_id' : this.files.length + 1,
						'file_src' : fileSrc,
						'file' : files
					};
					
					this.$emit('uploadFileInfo', obj);
				};
				
				let a = await reader.readAsDataURL(files);
			}
		},
		deleteFile(e){
			let idx = e.currentTarget.dataset.idx;
			
			this.$emit("deleteFileInfo", this.files[idx]);
		}

	}
});

/*
 * files : v-model
 * extChk	 :	1 - 전체
 * 				2 - 이미지
 */

// 아래는 등록된 파일명 + X 버튼!!

// 파일 등록 시, props로 push

// 받을 땐, v-model 형식으로 하면 될듯!!?