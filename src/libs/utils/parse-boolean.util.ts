export function parseBoolean(value: string): boolean {
	if (typeof value === 'boolean') {
		return value
	}
	if (typeof value === 'string') {
		const lowerCase = value.toLowerCase()
		if (lowerCase === 'true') {
			return true
		}
		if (lowerCase === 'false') {
			return false
		}
	}
	throw new TypeError(
		`Не удалось преобразовать значение "${value}" в логическое значение`
	)
}
