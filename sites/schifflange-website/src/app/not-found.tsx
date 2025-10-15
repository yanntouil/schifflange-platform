import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen text-xl flex items-center justify-center bg-gray-50'>
      <div className='max-w-md text-center'>
        <div className='mb-8'>
          <h1 className='text-9xl font-bold text-gray-200'>404</h1>
        </div>

        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Page not found</h2>

        <p className='text-gray-600 mb-8'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <Link
          href='/en'
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
