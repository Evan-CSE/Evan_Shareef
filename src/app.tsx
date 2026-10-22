import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout'
import { HomePage } from './pages/home'
const WorkPage = lazy(() =>
  import('./pages/work').then((module) => ({ default: module.WorkPage })),
)
const CaseStudyPage = lazy(() =>
  import('./pages/case-study').then((module) => ({
    default: module.CaseStudyPage,
  })),
)
const WritingPage = lazy(() =>
  import('./pages/writing').then((module) => ({ default: module.WritingPage })),
)
const PostPage = lazy(() =>
  import('./pages/post').then((module) => ({ default: module.PostPage })),
)
const AboutPage = lazy(() =>
  import('./pages/about').then((module) => ({ default: module.AboutPage })),
)
const ResumePage = lazy(() =>
  import('./pages/resume').then((module) => ({ default: module.ResumePage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/not-found').then((module) => ({ default: module.NotFoundPage })),
)

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<CaseStudyPage />} />
          <Route path="writing" element={<WritingPage />} />
          <Route path="writing/:slug" element={<PostPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

