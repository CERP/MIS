import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'


interface P {
}

type PropsType = P & RouteComponentProps

const List: React.FC<PropsType> = (props) => {

    return <div className="flex flex-wrap content-between">

    </div>
}

export default withRouter(List)
