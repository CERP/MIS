import Dynamic from '@ironbay/dynamic'
import moment from 'moment'
// if a component has a form, it should include an instance of this class.
// using @ironbay/dynamic for manipulating deeply nested objects
// 
export default class Former {

	constructor(_component, base_path) {

		this._component = _component;
		this.base_path = base_path;

	}

	handle(path, validate = (x) => true, cb = () => { }) {

		return e => {
			const value = this._getValue(e)
			const full_path = [...this.base_path, ...path]
			if(validate(value)) {
				this._component.setState(state => Dynamic.put(state, full_path, value), cb)
			}
		}
	}

	super_handle(path, validate = (x) => true, cb = () => { }) {

		const full_path = [...this.base_path, ...path]

		return {
			onChange: e => {
				const value = this._getValue(e)
				if(validate(value))
				{
					this._component.setState(state => Dynamic.put(state, full_path, value), cb)
				}
			},
			value: Dynamic.get(this._component.state, full_path),
			checked: Dynamic.get(this._component.state, full_path)
		}
	}

	super_handle_flex = (path, args) => {

		const default_args = {
			validate: (val) => true,
			cb: () => { },
			styles: (val) => ({})
		}

		const { validate, cb, styles } = {...default_args, ...args};
		const full_path = [...this.base_path, ...path]

		return {
			onChange: e => {
				const value = this._getValue(e)
				if(validate(value))
				{
					this._component.setState(state => Dynamic.put(state, full_path, value), cb)
				}
			},
			value: Dynamic.get(this._component.state, full_path),
			checked: Dynamic.get(this._component.state, full_path),
			style: styles(Dynamic.get(this._component.state, full_path))
		}
	}

	_getValue(event) {
		if(event.target.type === "checkbox") {
			return event.target.checked;
		}

		if(event.target.type === "date") {
			return moment(event.target.value, "YYYY-MM-DD").unix() * 1000;
		}

		// booleanify
		let val = event.target.value;

		if(val === "true") {
			val = true;
		}

		if(val === "false") {
			val = false;
		}

		return val;
	}

}