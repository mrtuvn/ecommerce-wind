import fs from 'node:fs/promises'
import mkcert from 'vite-plugin-mkcert'
//import htmlPurge from "vite-plugin-html-purgecss";

const files = await fs.readdir('../js', {})
const entryPoints = files.reduce((obj, file) => {
    if (!file.endsWith('.js')) {
        return obj
    }

    obj[file.replace('.js', '')] = `../js/${file}`
    return obj
}, {})

export default {
    root: '../',
    base: 'https://localhost:3000/',
    server: {
        https: true,
        hmr: {
            host: 'localhost'
        },
        watch: ['../../**/templates/*.phtml']
    },
    plugins: [
        //htmlPurge(),
        mkcert(),
        {
            name: 'template-reload',
            enforce: 'post',
            handleHotUpdate({ file, server }) {
                if (file.endsWith('.phtml')) {
                    server.ws.send({
                        type: 'full-reload',
                        path: '*'
                    })
                }
            }
        }
    ],
    build: {
        manifest: true,
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: entryPoints
        }
    }
}
