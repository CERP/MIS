import React from 'react'

import { AppLayout } from 'components/Layout/appLayout'

export const PrintVoucher = () => {

    return (
        <AppLayout title={"Print Voucher"}>
            <div className="p-5 md:p-10 md:pb-0 relative">
                <div className="text-2xl font-bold mt-4 mb-8 text-center">Print Voucher</div>
            </div>
        </AppLayout>
    )
}