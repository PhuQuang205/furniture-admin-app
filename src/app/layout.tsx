import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {UserProvider} from "@/context/UserContext";

// Nếu có plugin bạn muốn chạy sau khi hydrate thì mới giữ lại, còn không nên bỏ dần
// import PluginInit from "@/helper/PluginInit"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "WowDash Admin Dashboard",
    description: "Next.js + Tailwind + shadcn/ui admin dashboard",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        {/* Plugin init – chỉ dùng tạm thời nếu theme gốc cần */}
        {/*<PluginInit />*/}
        <UserProvider>{children}</UserProvider>

        </body>
        </html>
    )
}
