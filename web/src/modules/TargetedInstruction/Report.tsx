import * as React from 'react';

interface P {
    name: string
}
const Report: React.FC<P> = (props: any) => {
    return <h1>Hello report</h1>;
}

export default Report