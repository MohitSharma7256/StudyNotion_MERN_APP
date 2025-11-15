import React from "react"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

// add multiple icon packs so iconName like "MdCategory" works
import * as VscIcons from "react-icons/vsc"
import * as MdIcons from "react-icons/md"
import * as FaIcons from "react-icons/fa"
import * as RiIcons from "react-icons/ri"
import * as GiIcons from "react-icons/gi"
import * as BsIcons from "react-icons/bs"
import * as Io5Icons from "react-icons/io5"

/**
 * SidebarLink
 * -----------
 * Renders a NavLink with the supplied icon. When clicked we reset any
 * course-builder state so navigation stays clean between sections.
 */
const SidebarLink = ({link, iconName}) => {
    // Resolve icon from multiple icon packs (fall back to null)
    const Icon =
      (iconName && (
        VscIcons[iconName] ||
        MdIcons[iconName] ||
        FaIcons[iconName] ||
        RiIcons[iconName] ||
        GiIcons[iconName] ||
        BsIcons[iconName] ||
        Io5Icons[iconName]
      )) || null;

    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
      }
  return (
    <NavLink
    to={link.path}
    // Clean slate for course builder/editor flows when navigating.
    onClick={() => dispatch(resetCourseState())} 
    className={`relative px-8 py-2 text-sm font-medium ${
      matchRoute(link.path)
        ? "bg-yellow-800 text-yellow-50"
        : "bg-opacity-0 text-richblack-300"
    } transition-all duration-200`}
  > 
    {/* Yellow bar */}
    <span
      className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
        matchRoute(link.path) ? "opacity-100" : "opacity-0"
      }`}
    ></span>
    <div className="flex items-center gap-x-2">
      {/* Icon Goes Here - render placeholder if icon not found */}
      {Icon ? <Icon className="text-lg" /> : <span className="inline-block w-4" />}
      <span>{link.name}</span>
    </div>
  </NavLink>
  )
}

export default SidebarLink
