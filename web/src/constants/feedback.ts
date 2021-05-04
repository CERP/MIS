export interface Feedback {
	name: string
	avatar: string
	body: string
	school: string
	type: 'Owner' | 'Principal'
}

export const feedbacks: Feedback[] = [
	{
		name: 'Sir Azmat Siddiqui',
		avatar: '/images/taimur.jpg',
		body:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam.',
		school: 'Govt. AV Modern school',
		type: 'Principal'
	},
	{
		name: 'Mudassar Ali',
		avatar: '/images/mudassar.jpeg',
		body:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam.',
		school: 'The knowledge school - Kasur',
		type: 'Principal'
	},
	{
		name: 'Muhammad Riaz',
		avatar: '/images/ayesha.jpg',
		body:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum leo nisi, vitae efficitur risus porta a. Nulla lacus ipsum, iaculis ut bibendum in, porta ut quam.',
		school: 'Wisdom School System - Sialkot',
		type: 'Owner'
	}
]
