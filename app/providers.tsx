"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter, usePathname } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Spinner } from "@nextui-org/spinner";
import { dryrun } from "@permaweb/aoconnect";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();
	const pathname = usePathname();

	React.useEffect(() => {
		if (pathname === "/") {
			return;
		}

		const result = dryrun({
			process: process.env.PROCESS_ID ? process.env.PROCESS_ID : "",
			data: '',
			tags: [{name: 'Action', value: 'Translate'}, {name: "Code", value: pathname.split('/')[1]}],
			anchor: 'shartar-frontend',
		}).then((result) => {
			if (!!result.Error) {
				router.push('/?error=query-error');
			}
			const translation = result.Messages[0].Data;
			if (translation === 'Invalid') {
				router.push('/?error=invalid-code');
			} else {
				router.push(translation);
			}
		}).catch((error) => {
			router.push('/?error=query-error');
		});
	}, [router, pathname]);

	if (pathname === "/") {
		return (
			<NextUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
			</NextUIProvider>
		);
	} else {
		return (
			<NextUIProvider>
				<NextThemesProvider {...themeProps}>
					<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
						<Spinner size="lg" label="Loading..."/>
					</section>
				</NextThemesProvider>
			</NextUIProvider>
		);
	}
}
