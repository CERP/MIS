import moment from 'moment'

type payment = {
	student: MISStudent
	payment_id: string
} & MISStudentPayment

// i want this function wrapped in comlink

export function checkStudentDuesReturning(student: MISStudent): payment[] {
	const curr = moment().format("MM/YYYY")

	const payments: payment[] = []

	for(const [id, fee] of Object.entries(student.fees || {})) {
		if(fee.period === "MONTHLY" && student.Active) {
			// check if this fee exists in "owed" column.

			const existing_monthly = Object.values(student.payments || {})
				.find(p => {
					return p.fee_id === id && moment(p.date).format("MM/YYYY") === curr
				});
			if(existing_monthly === undefined) { // there is no payment for this month owed yet
				// create it
				const amount = (fee.type === "FEE" ? 1 : -1) * parseFloat(fee.amount);

				payments.push({
					student,
					payment_id: `${curr}-${id}`,
					amount,
					date: moment().startOf('month').unix() * 1000, 
					type: "OWED",
					fee_id: id,
					fee_name: fee.name
				});

			}
		}

		if(fee.period === "SINGLE") {
			const existing_one_time = Object.values(student.payments || {})
				.find(p => p.fee_id === id);
			if(existing_one_time === undefined) {
				const amount = (fee.type === "FEE" ? 1: -1) * parseFloat(fee.amount);

				payments.push({
					student,
					payment_id: id,
					amount,
					date: moment.now(),
					type: "OWED",
					fee_id: id,
					fee_name: fee.name
				});
			}
		}
	}

	return payments;
}