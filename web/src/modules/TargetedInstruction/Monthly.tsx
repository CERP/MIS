import * as React from 'react';
import Layout from 'components/Layout'
import { Link } from 'react-router-dom'

interface WelcomeProps {
    name: string
}
const Monthly: React.SFC<WelcomeProps> = (props: any) => {
    return <h1>Hello Monthly</h1>;
}

export default Monthly