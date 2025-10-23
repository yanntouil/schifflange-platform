import React from "react"
import { LibraryChildLibraries } from "./library.child-libraries"
import { LibraryDocuments } from "./library.documents"
import { LibraryHeader } from "./library.header"

/**
 * Library
 * Component that displays a library
 */
export const Library: React.FC = () => {
  return (
    <>
      <LibraryHeader />
      <LibraryChildLibraries />
      <LibraryDocuments />
    </>
  )
}
