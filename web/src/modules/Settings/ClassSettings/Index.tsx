import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import Layout from 'components/Layout'
import DefaultFeeSettings from './DefaultFee'
import VoucherSettings from './Voucher'

import './style.css'

type propsType = RouteComponentProps

const ClassSettings = (props: propsType) => {

    return <Layout history={props.history}>
        <div className="class-settings">
            <VoucherSettings />
        </div>
    </Layout>
}
export default ClassSettings