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
		avatar: 'https://storage.googleapis.com/mischool/av.jpeg',
		body:
			'The MISchool application is very useful, user friendly and has helped us in establishing a reputation as an organized and efficient government school. We regularly use MISchool for the attendance and diary modules to keep parents informed and satisfied. Sending the attendance SMS’s has not only helped decrease student and teacher absenteeism, but has also been an effective tool to ensure the security of the students.',
		school: 'Govt. AV Modern school',
		type: 'Principal'
	},
	{
		name: 'Ali Imran',
		avatar: 'https://storage.googleapis.com/mischool/tks.jpeg',
		body:
			"MISchool is not just an application, it's a collection of high-quality and useful services that has helped me become a better school leader and business owner. Our school has been using MISchool for 2 years now, and it has greatly facilitated us in managing the school by documenting our data and saving both our time and cost. The Fees and Exam modules have been the most beneficial for us.",
		school: 'The knowledge school - Kasur',
		type: 'Principal'
	},
	{
		name: 'Muhammad Riaz',
		avatar: 'https://storage.googleapis.com/mischool/wisdom.jpeg',
		body:
			'I have been a customer of MISchool since the last 4 years and have been using it in all our school branches. It is an efficient tool to monitor all activities of your school from anywhere in the world. It has not only greatly helped in tracking student’s performance but also their financial records and fees collection. I am especially grateful for the free updates of the application as it always makes us feel supported and valued by the MISchool team.',
		school: 'Wisdom School System - Sialkot',
		type: 'Owner'
	}
]
