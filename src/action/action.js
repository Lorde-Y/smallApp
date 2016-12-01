const UNDOABLE = 'UNDOABLE';

export function undoable(left, top) {
	return {
		type: UNDOABLE,
		left,
		top
	}
}