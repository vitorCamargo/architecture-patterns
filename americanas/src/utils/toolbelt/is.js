
export default function is(Ctor, val) {
	if (val === null || typeof val === 'undefined') {
		return false;
	}
	return val !== null && val.constructor === Ctor || val instanceof Ctor;
};
