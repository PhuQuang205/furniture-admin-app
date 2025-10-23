import React from "react";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface PageHeaderProps {
	title: string;
	breadcrumbs: { label: string; href?: string }[];
}

export const PageHeader = ({ title, breadcrumbs }: PageHeaderProps) => {
	return (
		<div className="flex items-center justify-between">
			<h1 className="text-2xl font-semibold">{title}</h1>
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((item, index) => {
						const isLast = index === breadcrumbs.length - 1;
						return (
							<React.Fragment key={index}>
								<BreadcrumbItem>
									{item.href && !isLast ? (
										<BreadcrumbLink asChild>
											<Link href={item.href}>{item.label}</Link>
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{item.label}</BreadcrumbPage>
									)}
								</BreadcrumbItem>

								{!isLast && <BreadcrumbSeparator />}
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
};
