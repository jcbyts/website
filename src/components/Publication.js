import React from "react";
import Link from "../components/Link"

import "./Publication.scss";

const Publication = ({ link, title, authors, journal, year, page, highlights, ...props }) => {
  return (
    <div className="Publication">
      <header>
        <Link to={link} className="Publication__header">
          { title }
          <div className="Publication__link-out">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </div>
        </Link>
      </header>
      <div className="Publication__authors">
        { authors }
      </div>
      <div className="Publication__metadata">
        <div>
          <span className="Publication__journal">
          { journal }
          </span>
          <span className="Publication__year">
            { year }
          </span>
        </div>
        <div className="Publication__location">
          { page }
        </div>
      </div>
      {highlights && (
        <div className="Publication__highlights">
          {highlights.map(({ title, where, authors, link }) => (
            <div className="Publication__highlight" key={title}>
              <Link to={link} className="Publication__title">
                { title } { where && <>in <i>{ where }</i></>}
              </Link>
              <div>
                { authors }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Publication