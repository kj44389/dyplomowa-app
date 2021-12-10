import React from 'react'
import { BellIcon, UserIcon } from '@heroicons/react/outline'
import UserInfo from './UserInfo'


function index() {
     return (
          <div className='text-gray-100 flex space-x-4 pl-4 pr-4 h-full bg-opacity-20 bg-gray-700' alt="Notifications">
               <BellIcon className='w-6 cursor-pointer hover:text-primary transition-colors' alt='Notifications' />
               <UserInfo />
               
               
          </div>
     )
}

export default index
