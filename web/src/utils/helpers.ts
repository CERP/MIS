/**
 * description: takes time in seconds and return string in format
 *              like "1:01" or "4:03:59" or "123:03:59"
 * @param time
*/

export const getTimeString = (time: number): string => {
	
	// using tilde(~) instead of Math.floor()

	const hrs = ~~(time / 3600)
	const mins = ~~((time % 3600) / 60)
	const secs = ~~time % 60
	
	let ret = ""
	if (hrs > 0) {
		ret = "" + hrs + "h:" + (mins < 10 ? "0" : "")
	}
	ret += "" + mins + "m:" + (secs < 10 ? "0" : "")
	ret += "" + secs + "s"

	return ret
}

/**
 *  description: Make position of <body> fixed to hide scroll on modal popup
 * 	There are numbers of ways to achieve this but I'm using simple approach
 */
 export const hideScroll = (): void => {
	document.body.style.position = 'fixed'
 }
 export const showScroll = (): void => {
	 document.body.style.position = ''
 }
 
 /**
  *  check it's mobile device or not
  */
export const isMobile = () => {
	 return /Mobi|Android/i.test(navigator.userAgent)
}

export const getIlmxUser = (): string => {
	return localStorage.getItem("user")
}