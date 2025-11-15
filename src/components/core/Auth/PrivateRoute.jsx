import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../utils/constants';

/**
 * PrivateRoute
 * ------------
 * Shared wrapper that:
 * 1. Ensures a token exists
 * 2. Redirects pending instructors to the holding page
 * 3. Locks admin paths to ADMIN accounts only
 */
const PrivateRoute = ({children}) => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const location = useLocation();

    if(token === null) {
        return <Navigate to="/login" />
    }

    const isPendingApprovalRoute = location.pathname === "/pending-approval";
    const awaitingApproval = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && user?.approved === false;

    if(awaitingApproval && !isPendingApprovalRoute) {
        return <Navigate to="/pending-approval" replace />
    }

    if(location.pathname.startsWith("/dashboard/admin") && user?.accountType !== ACCOUNT_TYPE.ADMIN) {
        return <Navigate to="/dashboard/my-profile" replace />
    }

    return children

}

export default PrivateRoute
