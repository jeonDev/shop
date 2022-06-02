const logoutComponent = Vue.component('logout-form', {
	template : `
		<div></div>
	`,
	methods: {
		// 로그아웃
		logout(){
			httpRequest({
				url: "logout",
				method: "POST",
				withCredentials: true
			})
			.then((rs) => {
				localStorage.removeItem("Authorization")
				$(location).attr('href', '/shop');
			})
			.catch((error) => {
				alert(error.data.message);
				$(location).attr('href', '/shop');
			});
		}
	},
	created() {
		if(confirm("로그아웃 하시겠습니까?")){
			this.logout();
		} else {
			this.$router.go(-1);
		}
		
	}
});