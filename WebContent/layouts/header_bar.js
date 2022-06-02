Vue.component('header-bar', {
	template: `
		<header class="navbar navbar-expand-sm justify-content-between">
			<div>
				<router-link :to="{path:'/shop'}" class="btn btn-outline-light text-dark">
					SHOP
				</router-link>
			</div>
			<div>
				<ul class="navbar-nav">
					<li class="nav-item" v-for="(item, index) in menus">
						<router-link :to="{ path: item.LOC }" class="nav-link">
							{{ item.MENU_NAME }}
						</router-link>
						<!-- <a class="nav-link" :href="item.LOC">{{item.MENU_NAME}}</a> --> 
					</li>
				</ul>
			</div>
			
		</header>
	`,
	data(){
		return{
			menus : []
		}
	},
	methods: {
		getMenuList(){
			var data = {"menu_div" : "LOGIN_MENU"};
			
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