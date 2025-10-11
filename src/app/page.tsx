import MasterLayout from "@/masterLayout/MasterLayout";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Inter} from "next/font/google";


export const metadata = {
    title: "WowDash NEXT JS - Admin Dashboard Multipurpose Bootstrap 5 Template",
    description:
        "Wowdash NEXT JS is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.",
};

const Page = () => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                {/*<Breadcrumb title='AI' />*/}

                {/*/!* DashBoardLayerOne *!/*/}
                {/*<DashBoardLayerOne />*/}

                {/* Breadcrumb */}
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        {/*<BreadcrumbSeparator />*/}
                        {/*<BreadcrumbItem>*/}
                        {/*    <BreadcrumbLink href="#">AI</BreadcrumbLink>*/}
                        {/*</BreadcrumbItem>*/}
                    </Breadcrumb>
                </div>
            </MasterLayout>
        </>
    );
};

export default Page;
