import React from 'react';
const ReportCard = ({ username = "Default Username", avatar = "https://via.placeholder.com/80", description = "Default description", label = "Default Label" }) => {
    return (
        <div className="bg-gray-200 shadow-md rounded-lg p-4">
            <div className="flex flex-row gap-x-2 ">
                <img 
                    src={avatar} 
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
                <div>
                    <h2 className="text-md font-bold text-gray-800">{username}</h2>
                    <div className="inline-block bg-blue-100 text-blue-600 text-xs font-medium rounded-md p-1">
                        {label}
                    </div>
                    <p className="text-gray-500 overflow-hidden text-ellipsis max-h-16 leading-5">{description}</p>                   
            
                </div>
               
            </div>
           
        </div>
    );
};

export default ReportCard;
