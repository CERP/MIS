const login_strategies = [
	"Agent",
	"Agent School",
	"Association",
	"Edfin",
	"School Referral",
	"Area Manager",
	"Ilm Exchange",
    "Facebook",
    "Other"
]

const agents = [
	"M. Shahbaz",
	"Sadaf Tauqeer",
	"Umar Zaheer",
	"M.Zikran shakeel",
	"M.Farooq",
	"Tabassum Munir",
	"M.Ahmad",
	"Qasim M. Chadhary",
	"M.Tayyab",
	"Tariq Mehmood",
	"Haroon Shahzad",
	"Sheraz Ahmed",
	"M.Suleman",
	"Raheel Abbas",
	"Huraira Abbas",
	"Zeeshan",
	"Raza Mustafa"
]

const referrals = [
	// SCHOOL REFERRAL BLOCK
	{
		path: ["value", "school_name"],
		value: "",
		depends: [
			"OR",
			{
				path: ["profile", "type_of_login"],
				value: "SCHOOL_REFERRAL"
			},
			{
				path: ["profile", "type_of_login"],
				value: "AGENT_SCHOOL"
			}
		]
	},
	{
		path: ["value", "owner_easypaisa_number"],
		value: "",
		depends: [
			"OR",
			{
				path: ["profile", "type_of_login"],
				value: "SCHOOL_REFERRAL"
			},
			{
				path: ["profile", "type_of_login"],
				value: "AGENT_SCHOOL"
			}
		]
	},
	// ASSOCIATION BLOCK
	{
		path: ["value", "association_name"],
		value: "",
		depends: [
			{
				path: ["profile", "type_of_login"],
				value: "ASSOCIATION"
			}
		]
	},

	// AGENT BLOCK
	{
		path: ["value", "agent_name"],
		value: "",
		depends: [
			"OR",
			{
				path: ["profile", "type_of_login"],
				value: "AGENT"
			},
			{
				path: ["profile", "type_of_login"],
				value: "AGENT_SCHOOL"
			}
		]
	},

	{
		path: ["value", "previous_software_name"],
		value: "",
		depends: [
			{
				path: ["value", "previous_management_system"],
				value: "SOFTWARE"
			}
		]
	}
]
export const getStrategies = () => login_strategies
export const getAgents = () => agents
export const getReferrals = () => referrals
