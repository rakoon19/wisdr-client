import AppSideBar from "@/components/AppSideBar";


export default function AdminLayout({ children }) {
    return (
        <div className="flex w-full h-screen overflow-hidden bg-background">
            <AppSideBar />
            <main className="flex-1 h-full overflow-y-auto p-8 bg-default-50/50">
                {children}
            </main>
        </div>
    );
}