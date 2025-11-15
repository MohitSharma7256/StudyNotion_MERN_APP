import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { VscSignOut } from "react-icons/vsc"
import SidebarLink from "./SidebarLink"
import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import { useState } from "react"
import { ACCOUNT_TYPE } from "../../../utils/constants"

/**
 * Sidebar
 * -------
 * Role-aware navigation rail shown inside the dashboard shell.
 * Filters links by account type and prevents unapproved instructors
 * from seeing instructor-only entries.
 */
const Sidebar = () => {

    const { user, loading: profileLoading } = useSelector(
        (state) => state.profile
      )
      const { loading: authLoading } = useSelector((state) => state.auth)
      const dispatch = useDispatch()
      const navigate = useNavigate()
      // to keep track of confirmation modal
      const [confirmationModal, setConfirmationModal] = useState(null)

      if (profileLoading || authLoading) {
        return (
          <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
            <div className="spinner"></div>
          </div>
        )
      }

  return (
    <>
        <div className='flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10'>
            <div className='flex flex-col'>
                {/* Create Category - only visible to Admin users */}
                {user?.accountType === ACCOUNT_TYPE.ADMIN && (
                  <SidebarLink
                    link={{ name: "Create Category", path: "/dashboard/create-category" }}
                    iconName="MdCategory"
                  />
                )}

                {sidebarLinks.map((link)=>{
                        if (link.type && user?.accountType !== link.type) return null;
                        if (link.type === ACCOUNT_TYPE.INSTRUCTOR && user?.approved === false) return null;
                        return <SidebarLink key={link.id} link={link} iconName = {link.icon}/>
                        })}
            </div>

            <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

            <div className='flex flex-col'>
                <SidebarLink link={{name:"Settings", path:"/dashboard/settings"}} iconName="VscSettingsGear" />
                <button onClick={()=> {
                    setConfirmationModal({
                        text1: "Are you sure?",
                        text2: "You will be logged out of your account.",
                        btn1Text: "Logout",
                        btn2Text: "Cancel",
                        btn1Handler: ()=> dispatch(logout(navigate)),
                        btn2Handler: ()=> setConfirmationModal(null),
                    })
                }}
                className="px-8 py-2 text-sm font-medium text-richblack-300">
                    <div className="flex items-center gap-x-2">
                    <VscSignOut className="text-lg" />
                    <span>Logout</span>
                    </div>
                </button>
            </div>
        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

export default Sidebar