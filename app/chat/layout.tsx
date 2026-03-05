
// import { Header } from "@/components/header"

// Force dynamic rendering for all pages in /chat route
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}