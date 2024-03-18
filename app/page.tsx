'use client'

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { useSearchParams } from 'next/navigation'
import { GithubIcon, SearchIcon } from "@/components/icons";
import { Key, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Spacer } from "@nextui-org/spacer"
import { Spinner } from "@nextui-org/spinner";
import { message, result as aoResult, createDataItemSigner, dryrun } from "@permaweb/aoconnect";
import nextConfig from "../next.config";

export default function Home() {
	const params = useSearchParams();
	const [shortenContent, setShortenContent] = useState("");
	const [shortenError, setShortenError] = useState("");
	const [shortenResult, setShortenResult] = useState("");
	const [isShortening, setIsShortening] = useState(false);

	const [randomUrls, setRandomUrls] = useState([]);
	const [isRandomUrlsLoading, setIsRandomUrlsLoading] = useState(false);

	const loadRandomUrls = () => {
		if (!nextConfig.env) {
			return;
		}

		setIsRandomUrlsLoading(true);
		const result = dryrun({
			process: nextConfig.env.PROCESS_ID,
			data: '',
			tags: [{name: 'Action', value: 'GetRandomShortenedUrl'}, {name: "Num", value: "10"}],
			anchor: 'shartar-frontend',
		}).then((result) => {
			if (!!result.Error) {
				return;
			}
			const randomUrls = JSON.parse(result.Messages[0].Data);
			setRandomUrls(randomUrls);
			setIsRandomUrlsLoading(false);
		}).catch((error) => {
			setIsRandomUrlsLoading(false);
			return;
		});
	}

	useEffect(() => {
		loadRandomUrls();
	}, []);

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title({ size: "lg"})}>short</h1>
				<h1 className={title({ color: "violet", size: "lg" })}>ar&nbsp;</h1>
				<br />
				<h2 className={subtitle({ class: "mt-4" })}>
					Keep it Short, Store it Smart and Forever
				</h2>
			</div>

			<div className="flex gap-3">
				<Link
					isExternal
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.links.github}
				>
					<GithubIcon size={20} />
					GitHub
				</Link>
			</div>
			
			{ params.has("error") && (
				<div className="mt-8">
					<Snippet hideSymbol hideCopyButton variant="flat" color="danger">
						<span>
							<Code color="secondary">Error</Code> { params.get("error") }
						</span>
					</Snippet>
				</div>
			)}

			{ !!shortenError && (
				<div className="mt-8">
					<Snippet hideSymbol hideCopyButton variant="flat" color="danger">
						<span>
							<Code color="secondary">Error</Code> { shortenError }
						</span>
					</Snippet>
				</div>
			)}

			{ !!shortenResult && (
				<div className="mt-8">
					<Snippet hideSymbol variant="flat" color="success">
						<span>
							{ !!window ? window.location.origin : "" }/?q={ shortenResult }
						</span>
					</Snippet>
				</div>
			)}

			<div className="mt-8">
				<Input
					aria-label="Search"
					onChange={(event) => {
						setShortenContent(event.target.value);
					}}
					classNames={{
						inputWrapper: "bg-default-100",
						input: "text-sm",
					}}
					endContent={
						<Kbd className="hidden lg:inline-block" keys={["command", "enter"]}>
						</Kbd>
					}
					labelPlacement="outside"
					placeholder="Type to shorten..."
					startContent={
						<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
					}
					type="search"
				/>
			</div>
			
			<div className="mt-1">
				<Button 
					variant="shadow" 
					color="secondary" 
					isLoading={isShortening}
					onClick={async () => {
						setIsShortening(true);

						const urlRegex = new RegExp(/^(http|https):\/\/[^ "]+$/);
						if (!(globalThis as any) || !(globalThis as any).arweaveWallet) {
							setShortenError("No Arweave wallet detected");
							setIsShortening(false);
							return;
						}

						await (globalThis as any).arweaveWallet.connect(["SIGN_TRANSACTION"]);
						await message({
							process: process.env.PROCESS_ID ? process.env.PROCESS_ID : "",
							tags: [
							  { name: "Action", value: "Shorten" },
							  { name: "Url", value: shortenContent },
							],
							signer: createDataItemSigner((globalThis as any).arweaveWallet),
						}).then((messageId) => {
							aoResult({
								message: messageId,
								process: process.env.PROCESS_ID ? process.env.PROCESS_ID : "",
							  }).then(({ Messages, Spawns, Output, Error }) => {
								if (!!Error) {
								  setShortenError(Error);
								} else {
									if (Messages.length == 0) {
										setShortenError("No messages returned");
									} else {
										const result = Messages[0].Data;
										if (result === "Invalid") {
											setShortenError("Invalid URL");
										} else {
											setShortenResult(result);
										}
									}
								}
								setIsShortening(false);
							  }).catch((error) => {
								setShortenError(error);
								setIsShortening(false);
							  });
						}).catch((error) => {
							setShortenError(error);
							setIsShortening(false);
						});
					}}
				>
					Shorten
				</Button>
			</div>

			<Spacer y={4} />
			
			{/* <div className="max-w-lg"> */}
				<Table
					isHeaderSticky
					aria-label="Example table with client side sorting"
					bottomContent={
						<div className="flex w-full justify-center">
							<Button variant="flat" onPress={loadRandomUrls}>
							{isRandomUrlsLoading && <Spinner color="white" size="sm" />}
							Random
							</Button>
						</div>
					}
					classNames={{
						base: "max-h-[520px] overflow-scroll",
						table: "min-h-[120px]",
					}}
					>
					<TableHeader>
						<TableColumn key="original">Original</TableColumn>
						<TableColumn key="shortened">Shortened</TableColumn>
					</TableHeader>
					<TableBody
						isLoading={isRandomUrlsLoading}
						items={randomUrls}
						loadingContent={<Spinner />}
					>
						{(item) => {
							return (
								<TableRow key={Object.values(item)[0] as Key}>
									<TableCell>
										<Snippet hideSymbol variant="flat" color="default">
											<span>
												{ Object.keys(item)[0] }
											</span>
										</Snippet>
									</TableCell>
									<TableCell>
										<Snippet hideSymbol variant="flat" color="default">
											<span>
												{ !!window ? window.location.origin : "" }/?q={ Object.values(item)[0] as string }
											</span>
										</Snippet>
									</TableCell>
								</TableRow>
							)
						}}
					</TableBody>
				</Table>
			{/* </div> */}
		</section>
	);
}
