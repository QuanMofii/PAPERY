"use client"
import { useRouter } from 'next/navigation'

const LandingPage = () => {
    const router = useRouter()

    const handledashboardBtn = () => {
        router.push("/dashboard")
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <p className="">LandingPage</p>
            <button type="button" onClick={() => handledashboardBtn()}>
                Dashboard
            </button>
        </div>
    );
}
export default LandingPage;