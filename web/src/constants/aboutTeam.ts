export interface Team {
	name: string
	avatar_url: string
	designation: string
	district?: string
	phone?: string
}

const TeamMembers: Array<Team> = [
	{
		designation: 'Principal Investigator',
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/asimk-min.jpg',
		name: 'Asim Khwaja'
	},
	{
		designation: 'LEAPS Director',
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/aboutzainab.jpg',
		name: 'Zainab Qureshi'
	},
	{
		designation: 'Project Manager',
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/aboutrooh.jpg',
		name: 'Roohullah Gulzari'
	},
	{
		name: 'Taimur Shah',
		avatar_url: 'https://storage.googleapis.com/mischool/team/taimur.jpg',
		designation: 'Technology Lead'
	},
	{
		name: 'Ayesha Ahmed',
		avatar_url: 'https://storage.googleapis.com/mischool/team/ayesha.jpg',
		designation: 'Research Assistant'
	},
	{
		designation: 'Research Assistant',
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/aboutfarah.jpeg',
		name: 'Farah Basit'
	},
	{
		designation: 'Field Manager',
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/aboutumer.jpg',
		name: 'Umer Farooq'
	},
	{
		name: 'Bisma Hafeez',
		avatar_url: 'https://storage.googleapis.com/mischool/team/bisma.jpg	',
		designation: 'Call Center Assistant'
		// phone: "+923481112004"
	},
	{
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/aboutali.jpg',
		designation: 'Field Associate',
		name: 'Ali Husnain'
	},
	{
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/aboutasim.jpg',
		designation: 'Field Associate',
		name: 'Asim Zaheer'
	},
	{
		avatar_url: 'https://storage.googleapis.com/ilmx-product-images/aboutkaleem.jpg',
		designation: 'Field Associate',
		name: 'Kaleem Majeed'
	},

	// {
	// 	name: "Ali Ahmad",
	// 	avatar_url: "https://storage.googleapis.com/mischool/team/ali_ahmad.jpg",
	// 	designation: "Senior Developer"
	// },
	// {
	// 	name: "Mudassar Ali",
	// 	avatar_url: "https://storage.googleapis.com/mischool/team/mudassar.jpeg",
	// 	designation: "Developer",
	// },

	{
		name: 'Farooq Azhar',
		avatar_url: 'https://storage.googleapis.com/mischool/team/farooq_azhar.jpg',
		designation: 'Field Associate'
		// district: "Sialkot",
		// phone: "+923410924945"
	},
	{
		name: 'Zahid Riaz',
		avatar_url: 'https://storage.googleapis.com/mischool/team/zahid.jpg',
		designation: 'Field Associate'
		// district: "Gujranwala",
		// phone: "+923460089862"
	},
	{
		name: 'Ali Zohaib',
		avatar_url: 'https://storage.googleapis.com/mischool/team/ali_zohaib.jpg',
		designation: 'Field Associate'
		// district: "Lahore, Kasur & Sheikhupura",
		// phone: "+923410924944"
	}
]

export const getTeamMembersInfo = () => TeamMembers
