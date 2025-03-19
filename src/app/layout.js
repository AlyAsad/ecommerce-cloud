export const metadata = {
  title: 'E-Commerce',
  description: 'E-commerce website developed for Cloud Computing.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
