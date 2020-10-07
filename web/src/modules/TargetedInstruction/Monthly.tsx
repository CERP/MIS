import * as React from 'react';

interface WelcomeProps {
    name: string
}
const Monthly: React.FC<WelcomeProps> = (props: any) => {
    return <h1>Hello Monthly</h1>;
}

export default Monthly