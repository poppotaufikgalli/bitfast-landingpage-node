module.exports = {
    apps: [
        {
            name: "bitfast-landingpage",
            // Points directly to the Next.js execution binary
            script: "./node_modules/next/dist/bin/next",
            // Equivalent to running 'npm run start'
            args: "start",
            // Optional: Launches instances across all CPU cores for speed
            watch: true, // Only use this if you want auto-restarts on code updates
            ignore_watch: ["node_modules", "public/uploads"], // Prevents upload loops
            env: {
                NODE_ENV: "production"
            }
        }
    ]
}