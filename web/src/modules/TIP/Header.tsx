import React from 'react';
import { BackArrow, Burger, TIP } from 'assets/icons'
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface P {
}

type PropsType = P & RouteComponentProps

const Header: React.FC<PropsType> = ({ history }) => {

    return <div className="w-full bg-white mb-5">
        <div className=" shadow-md flex flex-row justify-between p-3">
            <div className="rounded-full shadow-lg bg-white w-10 h-10 flex justify-center items-center"
                onClick={() => history.goBack()}>
                <img className="h-4" src={BackArrow} />
            </div>
            <div>
                <img src={TIP} />
            </div>
            <div className="rounded-full shadow-lg bg-white w-10 h-10 flex justify-center items-center">
                <img className="h-3" src={Burger} />
            </div>
        </div>
    </div>
}

export default withRouter(Header)
