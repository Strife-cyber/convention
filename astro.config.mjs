// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
// NOTE: Update 'site' and 'base' with your actual GitHub username and repository name
export default defineConfig({
	// site: 'https://[username].github.io', // Uncomment and replace [username] with your GitHub username
	base: '/convention', // Update if your repository name is different
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'Code Conventions',
			description: 'Team code conventions and standards for Flutter and Unity projects',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
				fr: {
					label: 'Français',
					lang: 'fr',
				},
			},
			defaultLocale: 'root',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Strife-Cyber/convention' },
			],
		sidebar: [
			{
				label: 'Flutter',
				autogenerate: { directory: 'flutter' },
			},
			{
				label: 'Unity',
				autogenerate: { directory: 'unity' },
			},
			{
				label: 'Shared',
				autogenerate: { directory: 'shared' },
			},
		],
			customCss: [
				// Add custom CSS if needed
			],
			components: {
				// Custom components can be added here
			},
		}),
	],
});
