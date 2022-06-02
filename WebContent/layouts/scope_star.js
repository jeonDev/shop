const scopeStarComponent = Vue.component('scope-star', {
	props: ["scope"],
	template: `
		<div>
			<div class="review_rating">
				<div class="rating">
					<input type="checkbox" name="rating" id="rating1" value="1" class="rate_radio" title="1점" @click="checkScore($event.target.value)">
	                <label for="rating1"></label>
	                <input type="checkbox" name="rating" id="rating2" value="2" class="rate_radio" title="2점" @click="checkScore($event.target.value)">
	                <label for="rating2"></label>
	                <input type="checkbox" name="rating" id="rating3" value="3" class="rate_radio" title="3점" @click="checkScore($event.target.value)">
	                <label for="rating3"></label>
	                <input type="checkbox" name="rating" id="rating4" value="4" class="rate_radio" title="4점" @click="checkScore($event.target.value)">
	                <label for="rating4"></label>
	                <input type="checkbox" name="rating" id="rating5" value="5" class="rate_radio" title="5점" @click="checkScore($event.target.value)">
	                <label for="rating5"></label>
				</div>
			</div>
		</div>
	`,
	watch: {
		scope(){
			this.checkScore(this.scope);
		}
	},
	methods : {
		checkScore(value) {
			
			if(value == 0){
				$('[name=rating]').prop('checked', false);
			}
			
			$.each($('[name=rating]'), function(idx, item){
				let score = item.value;
				
				if(score <= value){
					item.checked = true;
				} else {
					item.checked = false;
				}
				
			});
			
			this.$emit('input', value);
		}
	}
});

/*
 * <scope-star :scope="변수" @input="value => 할당할 변수 = value"/>
 */