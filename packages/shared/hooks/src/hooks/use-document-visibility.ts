import React from 'react'

export const useDocumentVisibility = () => {
  const [documentVisible, setDocumentVisible] = React.useState(true)

  React.useEffect(() => {
    const handleDocumentVisibilityChange = () => {
      setDocumentVisible(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleDocumentVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleDocumentVisibilityChange)
    }
  }, [])

  return documentVisible
}
