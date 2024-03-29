import { browser } from '$app/environment';
import type { Server, Site, SmolblogContext, User } from '$lib/smolblog/types';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { localStorageStore } from '@skeletonlabs/skeleton';
import Smolblog from '$lib/smolblog';

export const ssr = false;

// function hasCode(obj: unknown): obj is { code: string|number } {
// 	return obj
// }

export const load: LayoutLoad = async ({ fetch }) => {
	let context: SmolblogContext = { token: null };
	let allSites: Site[] = [];
	let user: User | null = null;
	let server: Server | null = null;

	if (browser) {
		const store = localStorageStore<{ token: string | null }>('smolContext', { token: null });
		context = get(store);
	}

	if (context.token) {
		const api = Smolblog(context, fetch);
		try {
				allSites = await api.user.sites.list();
				user = await api.user.me();
				server = await api.server.info();
		} catch (error: unknown) {
			if (
				browser &&
				error instanceof Error &&
				error.cause &&
				typeof error.cause == 'object' &&
				'code' in error.cause &&
				error.cause.code == 'invalid_token'
			) {
				const store = localStorageStore<{ token: string | null }>('smolContext', { token: null });
				store.set({ token: null });
			}
		}
	}

	return { context, server, allSites, user };
};
