import React from 'react'
import { UserIcon, ChevronDownIcon } from '@heroicons/react/outline'

function UserInfo() {
     return (
          <div className='flex justify-center space-x-2 cursor-pointer w-full h-full pl-2 pr-2 hover:text-primary transition-colors'>
               <UserIcon className='w-6' alt='Notifications' />
               <span className='flex items-center max-w-[15.6ch] overflow-x-hidden'>jaroslawkudzia73@gmail.com</span>
               <ChevronDownIcon className='w-6'/>

          </div>
     )
}

export default UserInfo
