// import jwt_decode from 'jwt-decode';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
function PrivateComponent() {

    let Info = (localStorage.getItem('Info'))
    if (Info) {
        Info= JSON.parse(Info)
    }
    // console.log('Info: ', Info);

    //   var decoded = jwt_decode(Info)
    //   console.log('decoded: ', decoded);

    return (
        <>
            {Info ? (
                <Outlet token={Info}/>
            ) : (
                <>
                    <Navigate to='/' />
                </>
            )}
        </>
    )
}

export default PrivateComponent
