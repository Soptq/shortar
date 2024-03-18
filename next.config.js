/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(webpackConfig) {
        return {
            ...webpackConfig,
            optimization: {
                minimize: false,
                innerGraph: false,
            }
        };
    },
    env: {
        PROCESS_ID: process.env.PROCESS_ID,
    },
    typescript: {
        // ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
