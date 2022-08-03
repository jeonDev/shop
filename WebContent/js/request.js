// Axios 인스턴스 생성
const configHeaders = {"Authorization" : "Bearer " + localStorage.getItem("Authorization")};

const httpRequest = axios.create({
	baseURL		: server,
	timeout		: 1000,
	headers		: configHeaders
});

// 요청 인터셉터 추가
httpRequest.interceptors.request.use(
	// 요청을 보내기 전 로직
	function (config) {
		//console.log(config.headers["Authorization"]);
		$('#modal-loading').removeClass('display-none');
		return config;
	},
	// 요청 에러 발생 시 로직
	function (error) {
		return Promise.reject(error);
	}
);

// 응답 인터셉터 추가
httpRequest.interceptors.response.use(
	// 응답 로직
	function (response) {
		$('#modal-loading').addClass('display-none');
		return response;
	},
	// 응답 에러 발생 시 로직
	async function (error) {
		
		const originalRequest = error.config;
		
		if(error.response.status === 401 && !originalRequest._retry){
			console.log("토큰이 만료되어, 리프레시 토큰으로 재 요청 하는 중.");
			await axios({
				url: server + "refresh/token",
				method: "POST",
				withCredentials: true,
				headers	: configHeaders
			})
			.then((rs) => {
				
				if(rs.data.code == "0000"){
					let token = rs.data.accessToken;
					
					localStorage.setItem("Authorization", token);
					
					configHeaders["Authorization"] = "Bearer " + localStorage.getItem("Authorization", token);
					
					httpRequest.defaults.headers = configHeaders;
					
					originalRequest._retry = true;
					
					return axios(originalRequest);
				} else if(rs.data.code == "9999"){
					localStorage.removeItem("Authorization");
				}
			})
			.catch((error) => {
				
				console.log(error);
			});
		}
		
		$('#modal-loading').addClass('display-none');
		return Promise.reject(error.response);
	}
);