export default function toBoolean(b) {
	if (!isNaN(b || 'i')) {
		b = parseInt((b || 0) * 1, 10);
	}

	return !!b && (b + '').toLowerCase() !== 'false';
}
