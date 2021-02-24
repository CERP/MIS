import { hostHTTPS } from './hostConfig'

const encoder = new TextEncoder();

export async function hash(str: string): Promise<string> {
	try {
		const msgBuffer = encoder.encode(str);
		const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer)

		const hashArray = Array.from(new Uint8Array(hashBuffer))

		const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
		return hashHex;
	}
	catch (ex) {
		console.error(ex);

		return 'xxxxx'
	}

}

export const checkTime = async (): Promise<boolean> => {
	try {

		const reqOpts: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const response: ServerResponse = await fetch(`${hostHTTPS}/mis/server-time`, reqOpts)
			.then((res: Response) => res.json())

		const { os_time } = response
		const client_time = new Date().getTime()

		const diff = Math.abs(client_time - os_time)

		// timezone offset
		const threshold = 1 * 60 * 60 * 1000

		return diff < threshold

	} catch (ex) {
		console.log(ex)
		return true
	}
}


type ServerResponse = {
	os_time: number
}

/**
 * Takes a MIS student and check if it's validate student. A valid student means has id,
 * name and section id and is active as well
 * @param student
 */
export const isValidStudent = (student: MISStudent): boolean => {
	return !!(student && student.id && student.Name && student.section_id && student.Active)
} 