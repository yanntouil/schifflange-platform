import React, { Fragment } from 'react'

type ReplacementMap = {
  [key: string]: (content: string) => React.ReactNode
}

interface Props {
  text: string
  replacements: ReplacementMap
}
export const Interpolate: React.FC<Props> = ({ text, replacements }) => {
  return <>{parseTranslation(text, replacements)}</>
}
const regex = /{{(.*?):(.*?)}}/g
const parseTranslation = (text: string, replacements: ReplacementMap): React.ReactNode[] => {
  let lastIndex = 0
  const elements: React.ReactNode[] = []

  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, type, content] = match

    // Add text before the marker
    if (match.index > lastIndex) {
      elements.push(
        <Fragment key={`${lastIndex}-before`}>{text.slice(lastIndex, match.index)}</Fragment>
      )
    }

    // Check if type is defined and if a replacement function exists
    if (type && content && replacements[type]) {
      elements.push(
        <Fragment key={`${lastIndex}-replaced`}>{replacements[type](content)}</Fragment>
      )
    } else {
      // Add original marker if no replacement function is found
      elements.push(<Fragment key={`${lastIndex}-no-replacement`}>{fullMatch}</Fragment>)
    }

    lastIndex = regex.lastIndex
  }

  // Add remaining text after the last marker
  if (lastIndex < text.length) {
    elements.push(<Fragment key={`${lastIndex}-after`}>{text.slice(lastIndex)}</Fragment>)
  }

  return elements
}
