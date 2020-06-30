export const replaceSpecialCharsWithUTFChars = (text: string) => {
	return text
		.replace("?", "%3F")
		.split("=")
		.join("%3D")
		.split("&")
		.join("%26")
}

// this regx can be used to check string contain link or not
// "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
