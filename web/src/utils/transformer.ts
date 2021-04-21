import moment from 'moment'

export const transformer = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>) => {
	const { name, value, checked, type } = e.target
	
	if(type === "checkbox") {
		return { name, value: checked }
	}
	
	if(type === "radio") {
		return { name, value}
	}
	
	if(type === "date") {
		return { name, value: moment(value, "YYYY-MM-DD").unix() * 1000 }
	}
	 
	return { name, value }
}