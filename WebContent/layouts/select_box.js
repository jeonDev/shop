Vue.component('select-box', {
	props : [ 'obj', 'data' ],
	template: `
		<div>
			<select :id="obj.id" :name="obj.name" :class="obj.class" 
					@input="updateValue($event.target.value)"
					:value="data">
				<option v-if="obj.allView" value="">{{ obj.allViewNm }}</option>
				<option :value="item.CMN_CD" 
						:key="item.CMN_CD"  
						:disabled="item.disabled"
						v-for="(item, index) in obj.options">
					{{item.CMN_NM}}
				</option>
			</select>
		</div>
	`,
	methods : {
		updateValue(v){
			this.$emit('input', v);
		}
	},
	updated() {
		this.obj.selected ? $('#' + this.obj.id).val(this.obj.selected).prop('selected', true) : "";
	}
});

/*
# 입력
obj : {
	id : '',					// id 속성
	name : '',					// name 속성
	class : '',					// class 속성
	allView : true/false,		// 전체 or 선택 여부
	allViewNm : '',				// allView에 표시할 내용
	selected : '',				// 초기값
	options : [					// select options
			{"CMN_CD" : .., "CMN_NM" : ...} , {... , disabled: true}
		]
}
option : value

@input="value => Object = value"
 */