/**
 * Convert a string to title-case e.g. taimur -> Taimur,
 * taimur shah -> Taimur Shah
 *
 * @param text String to be title-cased
 * @param splitBy This is to split and join the string if it's concatenated with any string literal e.g. space, hyphen etc
 */
export const toTitleCase = (text: string, splitBy = ' ') => {
	if (!text) {
		return ''
	}

	return text
		.trim()
		.toLowerCase()
		.split(splitBy)
		.map(s => s.charAt(0).toUpperCase() + s.substring(1))
		.join(splitBy)
}

export default toTitleCase
