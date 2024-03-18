# Shortar

> Keep it Short, Store it Smart and Forever

Shortar is a URL shortener service backed by AO and AR.

> Process ID of Shortar contract: **yhs3HOQ5yLsMwV1j58QnmFSopvziimSg5bSeT4Z6kPI**
> Frontend deployment: **ar://KleghjLxaAy4bUsvdId_JZ3pExSba9qPpt8P6XV-v5Q**
> Frontend served by 4everland: **https://shortar.4everland.app/**

## Technologies Used

- [Arweave](https://www.arweave.org/)
- [Arweave Oasis](https://github.com/permaweb/ao)
- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Deploy Shortar contract to AO

The contract of Shortar is located in `contracts/shortar.lua`. You can deploy it to AO by using the following command:

```bash
aos

.load contracts/shortar.lua
```

### Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Replace `PROCESS_ID` with the process ID of the Shortar contract.

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/Soptq/shortar/blob/main/LICENSE).