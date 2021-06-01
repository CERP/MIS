import { v4 } from 'node-uuid'

export const blankClass = (): MISClass => ({
	id: v4(),
	name: '',
	classYear: 0,
	sections: {
		[v4()]: {
			name: 'DEFAULT'
		}
	},
	subjects: {
		Maths: true,
		English: true,
		Urdu: true,
		Islamiat: true
	}
})

export const defaultClasses: Record<string, number> = {
	Preschool: 0,
	'Play Group': 1,
	Nursery: 2,
	Prep: 3,
	'Class 1': 4,
	'Class 2': 5,
	'Class 3': 6,
	'Class 4': 7,
	'Class 5': 8,
	'Class 6': 9,
	'Class 7': 10,
	'Class 8': 11,
	'Class 9': 12,
	'Class 10': 13,
	'O Level': 14,
	'A Level': 15
}
