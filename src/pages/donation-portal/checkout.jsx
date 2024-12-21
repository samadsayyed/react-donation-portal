import React from 'react'
import DonationPortalLayout from "../../layout/donation-portal"
import Wizard from "../../components/Donation-portal/steps/Wizard"

const checkout = () => {
  return (
    <DonationPortalLayout>
    <Wizard/>
    </DonationPortalLayout>
  )
}

export default checkout