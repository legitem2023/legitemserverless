import React from 'react'
import PrivacyPolicy from './PrivacyPolicy'
import privacyPolicyData from '../../../json/Private.json'
const Privacy = () => {

  return (
    <div className="bg-[#f1f1f1]">
        <PrivacyPolicy privacyPolicyData={privacyPolicyData} />
    </div>
  )
}

export default Privacy