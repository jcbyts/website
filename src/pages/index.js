import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Home = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const content = data.content.nodes[0].html
  const bio = data.bio.nodes[0].html
  const title = data.bio.nodes[0].frontmatter.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Jacob Yates" />

      <h1>
        { title }
      </h1>

      <div dangerouslySetInnerHTML={{__html: bio}} />
      <br />
      <br />
      <br />
      <div dangerouslySetInnerHTML={{__html: content}} />
    </Layout>
  )
}

export default Home

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    content: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/home.md/"}}) {
      nodes {
        id
        html
      }
    }
    bio: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/bio.md/"}}) {
      nodes {
        id
        html
        frontmatter {
          title
        }
      }
    }
  }
`
