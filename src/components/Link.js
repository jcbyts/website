import React, { useMemo } from "react";
import classNames from "class-names";
import PropTypes from "prop-types";
import { Link as GatsbyLink } from "gatsby";
import { OutboundLink } from 'gatsby-plugin-google-analytics'

import "./Link.scss";

const Link = ({ to, buttonProps, isButton, isModal, doOpenInNewTab, className, children, ...props }) => {
    const isExternal = !to || !to.startsWith("/")

    const parsedClassName = useMemo(() => classNames(
        "Link",
        { "Link--is-button": isButton },
        className,
    ), [isButton, className])

    if (isExternal) return (
        <OutboundLink
            className={parsedClassName}
            href={to}
            target={doOpenInNewTab ? "_blank" : ""}
            rel={doOpenInNewTab ? "noreferrer noopener" : ""}
            {...props}>
            <LinkChildren
                {...{ buttonProps, isButton, children }}
            />
        </OutboundLink>
    )
    return (
        <GatsbyLink to={to} className={parsedClassName} {...props}>
            <LinkChildren
                {...{ buttonProps, isButton, children }}
            />
        </GatsbyLink>
    )
}

Link.propTypes = {
    to: PropTypes.string,
    buttonProps: PropTypes.object,
    isButton: PropTypes.bool,
    doOpenInNewTab: PropTypes.bool,
}
Link.defaultProps = {
    buttonProps: {},
    isButton: false,
    isModal: false,
    doOpenInNewTab: false,
}

export default Link


const LinkChildren = ({ buttonProps, isButton, children }) => (
    isButton ? (
        <button {...buttonProps}>
            { children }
        </button>
    ) : (
        children
    )
)