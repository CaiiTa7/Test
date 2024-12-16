import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculateur Fiscal pour Indépendants Belges',
  description: 'Optimisations fiscales pour indépendants belges. Calculez vos déductions pour épargne-pension, dons aux associations, et plus.',
  keywords: 'optimisations fiscales, indépendants belges, déductions fiscales, épargne-pension, dons aux associations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

