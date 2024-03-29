/* eslint-disable @typescript-eslint/no-unused-vars */
import ChannelSelectionField from "$lib/components/ChannelSelectionField.svelte";
import type { Content } from "$lib/components/Icons";
import type { FetchFunction } from "..";
import type { ContentPayload, SiteConfigContent, SitePermissionPayload, SiteSettingsPayload, SmolblogContext, SmolblogSiteApiClient } from "../types";
import { getSiteChannelsForAdmin, getSiteChannelsForForm, linkChannelAndSite } from "./channels";
import { deleteContent, deleteMedia, editContent, editMedia, getAvailableContent, getAvailableMedia, getContent, getDrafts, getMedia, newContent, newMedia } from "./content";
import { getSiteSettings, getSiteUsers, setSitePermission, setSiteSettings } from "./settings";

export default function smolblogSite(id: string, context: SmolblogContext, fetcher: FetchFunction): SmolblogSiteApiClient {
	return {
		setChannel: (channelId: string, push: boolean, pull: boolean) => linkChannelAndSite(channelId, push, pull, id, context, fetcher),
		channels: (admin: boolean = false) => admin ? getSiteChannelsForAdmin(id, context, fetcher) : getSiteChannelsForForm(id, context, fetch),
		config: {
			content: async () => defaultContentConfig(id, context, fetcher),
		},
		content: {
			list: (page = 1, pageSize = 20) => getAvailableContent(id, context, fetcher, pageSize, page),
			drafts: () => getDrafts(id, context, fetcher),
			get: (contentId: string) => getContent(contentId, id, context, fetcher),
			new: (payload: ContentPayload) => newContent(payload, id, context, fetcher),
			edit: (payload: ContentPayload) => editContent(payload, id, context, fetcher),
			delete: (contentId: string) => deleteContent(contentId, id, context, fetcher),
		},
		media: {
			list: (page = 1, pageSize = 20) => getAvailableMedia(id, context, fetcher, pageSize, page),
			get: (mediaId: string) => getMedia(mediaId, id, context, fetcher),
			new: (payload: FormData) => newMedia(payload, id, context, fetcher),
			edit: (mediaId, payload) => editMedia(mediaId, payload, id, context, fetcher),
			delete: (mediaId: string) => deleteMedia(mediaId, id, context, fetcher),
		},
		settings: {
			get: () => getSiteSettings(id, context, fetcher),
			set: (payload: SiteSettingsPayload) => setSiteSettings(id, context, fetcher, payload),
		},
		users: () => getSiteUsers(id, context, fetcher),
		setPermission: (payload: SitePermissionPayload) => setSitePermission(id, context, fetcher, payload),
	}
}

const defaultContentConfig: (id: string, context: SmolblogContext, fetcher: FetchFunction) => Promise<SiteConfigContent> = 
	async (id: string, context: SmolblogContext, fetcher: FetchFunction) => {
		return {
			base: [
				{
					name: 'published',
					label: 'Published',
					type: 'switch',
				},
				{
					name: 'authorId',
					label: 'Author',
					type: 'identifier',
					description: 'List a different user as the author.',
					attributes: {
						objects: await getSiteUsers(id, context, fetcher)
							.then(users => users.map(user => ({ value: user.user.id, display: user.user.displayName })))
					}
				},
				{
					name: 'publishTimestamp',
					label: 'Publish time',
					type: 'datetime',
					description: 'Set the time and date the content was published.'
				},
				{
					name: 'permalink',
					label: 'Permalink',
					type: 'display',
					description: 'Path to this content; not currently editable.'
				},
			],
			types: {
				note: {
					key: 'note',
					name: 'Note',
					formDefinition: [
						{
							name: 'text',
							label: 'What\'s going on?',
							type: 'markdown',
							required: true,
						}
					]
				},
				reblog: {
					key: 'reblog',
					name: 'Reblog',
					formDefinition: [
						{
							name: 'url',
							label: 'Reblog this address',
							type: 'url',
							required: true,
						},
						{
							name: 'comment',
							label: 'Add to the conversation',
							type: 'markdown',
							required: false,
						}
					],
				},
				picture: {
					key: 'picture',
					name: 'Picture',
					formDefinition: [
						{
							name: 'media',
							label: 'Pictures',
							type: 'media',
							required: true,
							description: 'You can select more than one picture.',
							attributes: {
								multiple: true,
								accept: 'image/*',
							}
						},
						{
							name: 'caption',
							label: 'Caption',
							type: 'markdown',
							required: false,
						}
					]
				}
			},
			extensions: {
				syndication: {
					key: 'syndication',
					name: 'Syndication',
						formDefinition: [
						{
							name: 'channels',
							label: 'Syndicate to',
							type: 'checkboxes',
							component: ChannelSelectionField,
							attributes: {
								channels: await getSiteChannelsForForm(id, context, fetch)
							}
						},
						{
							name: 'links',
							label: 'Links',
							type: 'multitext',
							attributes: {
								lowercase: true,
							},
							validators: [
								{
									key: 'allUrls',
									message: 'All links must be valid URLs.',
									func: async (val: unknown) => {
										const links = val as string[];
										return links.every(link => URL.canParse(link));
									},
								}
							]
						}
					],
				},
				tags: {
					key: 'tags',
					name: 'Tags',
					formDefinition: [
						{
							name: 'tags',
							label: 'Tags',
							type: 'multitext',
							attributes: {
								duplicates: true,
							}
						}
					]
				}
			}
		}
	};