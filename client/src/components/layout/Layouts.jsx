import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export function PublicLayout() {
    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] bg-slate-50">
                <main className="w-full">
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export function DashboardLayout() {
    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] bg-slate-50">
                <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-10 grid lg:grid-cols-[260px_1fr] gap-8 items-start">
                    <aside className="hidden lg:block sticky top-24 self-start">
                        <Sidebar />
                    </aside>
                    <main className="min-h-[70vh] w-full">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    )
}
