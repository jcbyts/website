import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Link from "../components/Link"
import Publication from "../components/Publication"

import "./publications.scss";

const Publications = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const publications = data.publications.nodes[0].frontmatter.publications

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Jacob Yates" />

      <div className="publications">
        <h1>
          Publications
        </h1>

        <div className="publications__list">
          {publications.map(publication => (
            <Publication {...publication} key={publication.title} />
          ))}
        </div>

      </div>




    </Layout>
  )
}

export default Publications

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
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
