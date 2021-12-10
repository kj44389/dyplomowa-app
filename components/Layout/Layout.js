import React from 'react'
import Navbar from './Navbar/Navbar'

function Layout({ children }) {
     return (
          <>
               {/* navbar */}
                    <Navbar/>
               {/* sidebar */}

               {/* content */}
               <main>

                    { children }
                    {/* foother */}
               </main>
          </>
     )
}

export default Layout
