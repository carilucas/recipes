import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav className='header'>
        <div>
          <Link href='/'>
            <a>Qarilucas Recipes</a>
          </Link>
        </div>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
