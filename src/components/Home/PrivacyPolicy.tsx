// components/PrivacyPolicy.js
import React from 'react';

const PrivacyPolicy = ({ privacyPolicyData }:any) => {
    return (
        <div className="bg-[#f1f1f1]">
            {Object.keys(privacyPolicyData.Privacy_Policy).map((sectionKey, index) => (
                <div className="privacy-section" key={index}>
                    <h2>{sectionKey.replace(/_/g, ' ')}</h2>
                    <p>{privacyPolicyData.Privacy_Policy[sectionKey].content}</p>
                </div>
            ))}
        </div>
    );
};

export default PrivacyPolicy;
