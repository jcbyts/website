import React from "react"
import Header from "./Header"

import "./layout.scss"

class Layout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div
        className="layout__contents"
      >
        <Header />
        <main>
            { children }
        </main>
        <footer>
          Shoot me an email at <a href="mailto:jacoby8s@gmail.com">jacoby8s@gmail.com</a>
        </footer>
      </div>
    )
  }
}

export default Layout
