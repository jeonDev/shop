function paymentImport(obj, data){
	//가맹점 식별코드
	IMP.init('imp10899433');
	IMP.request_pay({
	    pg : 'kcp',
	    pay_method : obj.pay_method,//'card',
	    merchant_uid : obj.merchant_uid,//'merchant_' + new Date().getTime(),
	    name : obj.product_name, //'상품1' , //결제창에서 보여질 이름
	    amount : obj.amount, //실제 결제되는 가격
	    buyer_email : obj.EMAIL,//'iamport@siot.do',
	    buyer_name : obj.NAME,//'구매자이름',
	    buyer_tel : obj.TEL,//'010-1234-5678',
	    buyer_addr : obj.ADDRESS,//'서울 강남구 도곡동',
	    buyer_postcode : obj.ZIP_CD//'123-456'
	}, function(rsp) {
		console.log(rsp);
	    if ( rsp.success ) {
	    	paymentCallback("Y", data, rsp);

	    	var msg = '결제가 완료되었습니다.';
//	        msg += '고유ID : ' + rsp.imp_uid;
//	        msg += '상점 거래ID : ' + rsp.merchant_uid;
//	        msg += '결제 금액 : ' + rsp.paid_amount;
//	        msg += '카드 승인번호 : ' + rsp.apply_num;
	    } else {
	    	paymentCallback("N", data, rsp);
//	    	var msg = '결제에 실패하였습니다.';
//	        msg += '에러내용 : ' + rsp.error_msg;
	    }
//	    alert(msg);
	});
}
// 결제 테스트
function paymentImportTest(obj, data){
	console.log("결제 테스트 진행!!");
	console.log(obj);
	let rsp = {success : true,error_msg : "테스트!"};
    if ( rsp.success ) {
    	paymentCallback("Y", data, rsp);
    } else {
    	paymentCallback("N", data, rsp);
    }
	
}

// 결제 후 콜백함수 ("Y" : 성공 / "N" : 실패)
function paymentCallback(paymentYn, obj, rsp) {
	
	let data = Object.assign({}, obj);
	data.paymentYn = paymentYn;
	
	httpRequest({
		url: "user/payment/callback",
		method: "POST",
		responseType: "json",
		data: data
	})
	.then((rs) => {
		let msg = "";
		if(rsp.success){
			msg = '결제가 완료되었습니다.';
			alert(msg);
			$(location).attr('href', '/shop/mypage');
		} else {
			msg = rsp.error_msg;
			alert(msg);
			console.log("메인화면으로 갈까? 아니면 그대로 페이지 유지?");
		}
		
	})
	.catch((error) => {
		console.log(error);
		alert(error.data.message);
	});
}