import { defineConfig } from 'astro/config'

// https://astro.build/config
import netlify from '@astrojs/netlify/functions'

// https://astro.build/config
export default defineConfig({
	output: 'server',
	site: 'https://adrianshaynes.netlify.app/',
	adapter: netlify(),
})
