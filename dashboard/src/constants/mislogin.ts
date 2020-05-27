const area_managers = [
	"Ayesha",
	"Ali Zohaib",
	"Farooq",
	"Kamran",
	"Noman",
	"Umer",
	"Zahid",
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

const districts = [
	"Lahore",
	"Sargodha",
	"Sialkot",
	"Gujranwala",
	"Faisalabad",
	"Islamabad",
	"Rawalpindi",
	"Kasur",
	"Sheikhupura"
]

const login_strategies = [
	"Agent",
	"Agent School",
	"Association",
	"Edfin",
	"School Referrals",
	"Individual",
	"Ilm Exchange"
]

export const getAreaManagers = () => area_managers
export const getAgents = () => agents.sort((a, b) => a.localeCompare(b))
export const getDistricts = () => districts
export const getStrategies = () => login_strategies