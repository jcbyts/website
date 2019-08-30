import React from "react"
import Link from "./Link"

import "./Header.scss"

const Header = () => {
  return (
    <div className="Header" >
      <Link className="Header__link" to="/">
        Jacob Yates
      </Link>

      <div className="Header__links">
        <Link className="Header__link" to="/publications">
          Publications
        </Link>
        <Link className="Header__link" to="/cv">
          CV
        </Link>
        <Link className="Header__link" to="/blog">
          Blog
        </Link>
      </div>
    </div>
  )
}

export default Header
