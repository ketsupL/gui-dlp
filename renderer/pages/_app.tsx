import type { AppProps } from 'next/app'
import { Layout } from '@/components/layout'
import { ThemeProvider } from 'next-themes'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false} 
      disableTransitionOnChange
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp
