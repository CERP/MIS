export interface Feedback {
	name: string
	avatar: string
	feedback: string
	school: string
	type: 'Owner' | 'Principal'
}

export const feedback: Feedback[]  = [
	{
		name: 'Taimur Shah',
		avatar: '/images/taimur.jpg',
		feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam.',
		school: 'Sarkar School',
		type: 'Principal'
	},
	{
		name: 'Mudassar Ali',
		avatar: '/images/mudassar.jpeg',
		feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam.',
		school: 'National School',
		type: 'Owner'
	},
	{
		name: 'Ayesha Ahmed',
		avatar: '/images/ayesha.jpg',
		feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam.',
		school: 'Ilm School',
		type: 'Principal'
	},
]