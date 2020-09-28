
const debounce = (f: any, wait: number): any => {

	let timeout: NodeJS.Timeout;

	return (...args: any[]) => {
		//@ts-ignore
		const fncall = () => f.apply(this, args);

		clearTimeout(timeout);
		timeout = setTimeout(fncall, wait);
	}

}

export default debounce;