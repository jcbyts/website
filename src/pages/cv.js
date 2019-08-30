import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Publication from "../components/Publication"

import "./cv.scss"

const Cv = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const cv = data.cv.nodes[0].frontmatter.cv
  const publications = data.publications.nodes[0].frontmatter.publications

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Jacob Yates" />

      <div className="cv">
        <h1>
          CV
        </h1>

        <div className="cv__list">
          {cv.map(({ title, items=[] }) => (
            <div className="cv__list__item" key={title}>
                <h3>
                  { title }
                </h3>

                <div className="cv__list__item__items">
                  {title.toLowerCase() == "publications" && (
                    publications.map(publication => (
                      <Publication {...publication} key={publication.title} />
                    ))
                  )}
                  {items && items.map(({ title, when, who, authors, where, tag, footnote }) => (
                    <div className="cv__item" key={title}>
                      <div className="cv__item__main">
                        <div className="cv__item__title">
                          { title }
                        </div>
                        {[who, authors, where, tag, footnote].filter(d => d).map(d => (
                          <div className="cv__item__note" key={d}>
                            { d }
                          </div>
                        ))}
                      </div>
                      <div className="cv__item__when">
                        { when }
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          ))}
        </div>

      </div>




    </Layout>
  )
}

export default Cv

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    cv: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/cv.md/"}}) {
      nodes {
        id
        frontmatter {
          cv {
            title
            items {
              title
              when
              where
              who
              footnote
            }
          }
        }
      }
    }
    publications: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/publications.md/"}}) {
      nodes {
        id
        frontmatter {
          publications {
            year
            title
            journal
            authors
            page
            link
            highlights {
              title
              where
              authors
              link
            }
          }
        }
      }
    }
  }
`
