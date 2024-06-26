// ** Next Imports
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'

// import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import { AuthProvider } from 'src/@core/context/AuthContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })

  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })

  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const ThemeComponent = dynamic(
  async () => {
    const mod = await import('src/@core/theme/ThemeComponent')

    return mod.default
  },
  { ssr: false }
)

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <div>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{themeConfig.templateName}</title>
          <meta
            name='description'
            content={`Admin - ${themeConfig.templateName}`}
          />
        </Head>

        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return <AuthProvider><ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent></AuthProvider>
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </CacheProvider>
    </div>
  )
}

export default App
