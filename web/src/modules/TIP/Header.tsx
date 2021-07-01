import React from 'react'
import { BackArrow, TIP } from 'assets/icons'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'

type PropsType = RouteComponentProps

const Header: React.FC<PropsType> = ({ history }) => {
	return (
		<div className="w-full bg-white mb-5 fixed">
			<div className=" shadow-md flex flex-row justify-between p-3">
				<div
					className="rounded-full shadow-lg bg-white w-10 h-10 flex justify-center items-center cursor-pointer"
					onClick={() => history.goBack()}>
					<img className="h-4" src={BackArrow} />
				</div>
				<div className="cursor-pointer">
					<Link to={'/targeted-instruction'}>
						<img className="h-8" src={TIP} />
					</Link>
				</div>
				<div className="rounded-full shadow-lg bg-white w-10 h-10 flex justify-center items-center cursor-pointer">
					<Link to={'/'}>
						<img className="h-6" src="/favicon.ico" />
					</Link>
				</div>
			</div>
		</div>
	)
}

export default withRouter(Header)
