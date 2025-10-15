import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: 'Preview',
  robots: 'noindex,nofollow', // Prevent search engines from indexing preview pages
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='fr'>
      <body style={{ margin: 0, padding: 0 }} className='bg-[#FAF6F1] text-default'>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
