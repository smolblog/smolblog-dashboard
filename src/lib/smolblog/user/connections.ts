import { smolFetch, type FetchFunction } from "..";
import type { ConnectorConnection, SmolblogContext } from "../types";

export function startConnectionSession(
	context: SmolblogContext, fetcher: FetchFunction,
	provider: string, returnTo: string,
) {
	return (smolFetch({
		endpoint: `/connect/init/${provider}?returnTo=${returnTo}`,
		token: context.token ?? undefined
	}, fetcher) as Promise<{ url: string }>).then(res => res.url);
}

export async function getMyConnections(context: SmolblogContext, fetcher: FetchFunction,) {
	return (smolFetch({ endpoint: '/my/connections', token: context.token ?? undefined }, fetcher) as Promise<{
		connections: ConnectorConnection[];
	}>).then(res => res.connections);
}

/*
export async function linkChannelAndSite(
	smolFetch: SmolblogFetch,
	siteId: string,
	payload: { channelId: string; push: boolean; pull: boolean }
): Promise<boolean> {
	const { channelId, pull, push } = payload;
	await smolFetch({
		endpoint: `/connect/link`,
		verb: 'PUT',
		payload: { siteId, channelId, push, pull }
	});

	return true;
}

export async function getSiteChannelsForAdmin(
	smolFetch: SmolblogFetch,
	siteId: string
): Promise<ConnectorChannelPlusLink[]> {
	const res = (await smolFetch({ endpoint: `/site/${siteId}/channels` })) as {
		channels: ConnectorChannelPlusLink[];
	};
	return res.channels;
}
*/