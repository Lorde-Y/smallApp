const initState = {
	left: 0,
	top: 0,
};
export function undoableReducer(state=initState, action) {
	switch (action.type) {
		case 'UNDOABLE':
			return {
				left: action.left,
				top: action.top
			}
		default:
			return state;
	}
}