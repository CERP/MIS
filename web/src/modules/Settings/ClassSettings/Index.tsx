import React from 'react'
import { RouteComponentProps } from 'react-router'
import Layout from 'components/Layout'
import VoucherSettings from './Voucher'

import './style.css'

type propsType = RouteComponentProps

const ClassSettings = (props: propsType) => {

    return <Layout history={props.history}>
        <VoucherSettings />
    </Layout>
}
export default ClassSettings