Vue.component('nav-bar', {
	template: `
		<nav class="navbar navbar-expand-sm bg-light justify-content-center mb-5">
			<ul class="navbar-nav">
				<li class="nav-item" v-for="(item, index) in menus">
					<router-link :to="{ path: item.LOC }" class="nav-link">
						{{ item.MENU_NAME }}
					</router-link>
					<!-- <a class="nav-link" :href="item.LOC">{{item.MENU_NAME}}</a> -->
				</li>
			</ul>
		</nav>
	`,
	data(){
		return{
			menus: []
		}
	},
	methods: {
		getMenuList(){
			var data = {"menu_div" : "NAV_MENU"};
			
			httpRequest({
				url: "get/menu/list",
				method: "GET",
				responseType: "json",
				params: data
			})
			.then((rs) => {
				this.menus = rs.data;
			})
			.catch((error) => {
				alert(error.data.message);
			});
		}
	},
	created() {
		this.getMenuList();
	}
});