const server = "http://localhost:8081/";
//정규식 체크
let idReg = /^[a-zA-Z0-9]{4,30}$/g;									// ID 정규식 (영문 숫자 4~30자)
let psReg = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z/d@$!%*?&]{8,30}$/;	// Password 정규식(영문 + 숫자 4~30자)
let nmReg = /^[가-힣]{2,4}$/g;										// 이름 정규식(한글 2~4자)
let mailReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
let telReg	= /^\d{2,3}\d{3,4}\d{4}$/;

let ROLE_NAME = "";
let NAME = "";

// ajax 요청
function reqDataAjax(type, url, dataType, async, successFun, data, contentType){
	var returnData;
	
	$.ajax({
		url			: url,
		type		: type,
		data		: data,
		dataType	: dataType,
		contentType	: contentType,
		async 		: async,
		headers		: { "Authorization" : "Bearer " + localStorage.getItem("Authorization") },
		beforeSend:function(){
	        $('#modal-loading').removeClass('display-none');
	    },
	    complete:function(){
	        $('#modal-loading').addClass('display-none');
	    },
		success 	: function(rs){
			successFun(rs);
			returnData = rs;
		}, 
		error 		: function(err){
			console.log("서버에 데이터 요청 시 에러 : " + err);
			console.log(err);
			if(err.responseText != ''){
				alert(err.responseText);
			}
		}
	});
	return returnData;
}

// 우편번호 검색 (우편번호, 주소1, 주소2)
function openZipSearch(zip, addr1, addr2) {
	new daum.Postcode({
		oncomplete: function(data) {
			$('#' + zip).val(data.zonecode);
			$('#' + addr1).val(data.address);
			$('#' + addr2).val(data.buildingName);
		}
	}).open();
}

// 화면 이동
function moveAnimate(id){
	let offset = $("#" + id).offset(); //해당 위치 반환
	$("html, body").animate({scrollTop: offset.top},400); // 선택한 위치로 이동. 두번째 인자는 0.4초를 의미한다.
}

// Date Format
function dateFormat(value){
	
	if(value == '' || !value) return '';
	
	let value_year = value.substr(0,4);
	let value_month = value.substr(4,2);
	let value_day = value.substr(6,2);
	
	let js_date = new Date(value_year, value_month, value_day);
	
	let year  = js_date.getFullYear();
	let month = js_date.getMonth();
	let day	  = js_date.getDate();
	
	if(month < 10) {
		month = '0' + month;
	}
	
	if(day < 10) {
		day = '0' + day;
	}
	
	return year + '. ' + month + '. ' + day;
}

let oEditors = [];

// Smart Editor
function smartEditor(content){
	
	console.log("Naver SmartEditor");
	
    nhn.husky.EZCreator.createInIFrame({
      oAppRef			: oEditors,
      elPlaceHolder		: "content",
      sSkinURI			: "/shop/editor/SmartEditor2Skin.html",
      htParams			: {
    	  bUseToolbar : true, 			// 툴바 사용 여부 (true:사용/ false:사용하지 않음) 
    	  bUseVerticalResizer : true, 	// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음) 
    	  bUseModeChanger : true, 		// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음) 
    	  fOnBeforeUnload : function() {
    		  alert("완료!");
    	  }
      },
      fOnAppLoad : function() { 
    	  // Editor 에 값 셋팅 
    	  if(content){
    		  oEditors.getById["content"].exec("PASTE_HTML", [content]);
    	  }
      },
      fCreator			: "createSEditor2"
    });
}

// editor 전송
function saveEditor(id){
	oEditors.getById[id].exec("UPDATE_CONTENTS_FIELD", []);
	let content = document.getElementById(id).value;

	if(content == '') {
		alert("내용을 입력해주세요.");
		oEditors.getById[id].exec("FOCUS");
		return;
	} else {
		return content;
	}
}

///////////////////////////////////////////////////////////////

// 메뉴 세팅
function menuMake(){
	$.ajax({
		  url : "http://localhost:8000/menu/select"
		, type : "GET"
		, dataType : "json"
		, success : function(rs){
			
			const menuUl = document.getElementById("menu-nav");	// 메뉴 ul
			const url	 = window.location.href;				// 현재 URL
			
			while ( menuUl.hasChildNodes() ) { 
				menuUl.removeChild( menuUl.firstChild ); 
			}
			
			$.each(rs, function(idx, item){
				
				let li	  = document.createElement("li");			 // 메뉴 추가 구성
				let a	  = document.createElement("a");			 // 메뉴링크
				let text  = document.createTextNode(item.menu_name); // 메뉴명
				let toUrl = item.loc;								 // 메뉴 주소

				a.href = toUrl;
				a.appendChild(text);
				
				// 하위 요소가 있을 경우.
				if(item.leaf == 0){
					
					li.className 	 = "dropdown";
					a.className  	 = "dropdown-toggle";
					a.dataset.toggle = "dropdown";
					
					let span = document.createElement("span");
					span.className	 = "caret";
					
					a.appendChild(span);
					
					let ul 		 = document.createElement("ul");
					ul.className = "dropdown-menu";
					ul.id		 = item.menu_id;
					
					li.appendChild(a);
					li.appendChild(ul);
					
					menuUl.appendChild(li);
				// 그 외,
				} else {

					li.appendChild(a);
					
					if(item.lvl === 0){
						menuUl.appendChild(li);
						
					// 하위 요소
					} else{

						let upMenu = document.getElementById(item.up_id);
						
						upMenu.append(li);
					}
					
				}
				
				// url이 현재 주소일 때
				if(url.indexOf(toUrl) !== -1){
					li.className = "active";
					if(item.leaf != 0) li.parentNode.parentNode.className = "active";
				}
				
			});
			
			
		}, error : function(err){
			console.log(err);
		}, beforeSend : function(){
			$('.wrap-loading').removeClass('display-none');
		}, complete : function(){
			$('.wrap-loading').addClass('display-none');
		}
	})
}

/*
 * 페이징 처리
 * getPagination(rs.paging, ".pagination", "selectMenu");
 * param1 : 페이징 정보
 * param2 : 페이징 표시 할 페이징 위치
 * param3 : 조회 함수
 * */
function getPagination(page, selector, selectFunction){
	
	let div		  = document.querySelector(selector);	// 페이징 표시할 선택자
	let start	  = page.startBlock;		// 첫 block
	let end		  = page.endBlock;			// 마지막 block
	let curPage   = page.curPage;			// 현재 page
	let count	  = page.count;				// 총 갯수
	let curBlock  = page.curBlock;			// 현재 Block
	let pageUnit  = page.pageUnit;			// 페이지 출력 건 수
	let blockUnit = page.blockUnit;			// 한 화면에 보여질 block 수

	// curBlock : 0일땐 X	
	if(curBlock != 0){
		// 처음으로 이동
		let firstLi 	= document.createElement("li");
		let firstA		= document.createElement("a");
		let firstText	= document.createTextNode("처음");
		
		firstA.href		= 'javascript:' + selectFunction + '("1")';
		firstA.appendChild(firstText);
		
		firstLi.appendChild(firstA);
		div.appendChild(firstLi);
	
		// 이전 Block
		let preLi 		= document.createElement("li");
		let preA		= document.createElement("a");
		let preText		= document.createTextNode("◀");
		
		preA.href		= 'javascript:' + selectFunction + '("' + (curBlock * blockUnit) + '")';
		preA.appendChild(preText);
		
		preLi.appendChild(preA);
		div.appendChild(preLi);
	}

	// 현재 Block의 page
	for(start; start <= end; start++){
		
		let li	 = document.createElement("li");
		let a	 = document.createElement("a");
		let text = document.createTextNode(start);
		
		a.href	 = 'javascript:' + selectFunction + '("' + start + '")';
		a.appendChild(text);
		
		if(curPage == start) li.className = "active";
		
		li.appendChild(a);
		
		div.appendChild(li);
	}
	
	// 다음 Block
	var endPage = Math.ceil(count / pageUnit);
	
	if(end < endPage){
		let nextLi 		= document.createElement("li");
		let nextA		= document.createElement("a");
		let nextText	= document.createTextNode("▶");
			
		nextA.href		= 'javascript:' + selectFunction + '("' + (((curBlock + 1) * blockUnit) + 1) + '")';
		nextA.appendChild(nextText);
			
		nextLi.appendChild(nextA);
		div.appendChild(nextLi);
	}

	// 마지막으로 이동
	let lastLi 		= document.createElement("li");
	let lastA		= document.createElement("a");
	let lastText	= document.createTextNode("마지막");
	
	lastA.href		= 'javascript:' + selectFunction + '("' + endPage + '")';
	lastA.appendChild(lastText);
	
	lastLi.appendChild(lastA);
	div.appendChild(lastLi);
	
}