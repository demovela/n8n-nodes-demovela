import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { executeOperations, type Operation, type ResourceRoute } from './transport';
import operations from './operations.json';
import routes from './routes.json';

export class Demovela implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Demovela',
		name: 'demovela',
		icon: {
			light: 'file:demovela.svg',
			dark: 'file:demovela.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Automate your Demovela account',
		defaults: {
			name: 'Demovela',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'demovelaOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Template',
						value: 'templates',
					},
					{
						name: 'Video',
						value: 'videos',
					},
					{
						name: 'Video Draft',
						value: 'video-drafts',
					},
				],
				default: 'account',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Profile',
						value: 'get_profile',
						description:
							"Read the signed-in customer's own Demovela account profile. Does not search for or identify other people.",
						action: 'Get profile in demovela',
					},
				],
				default: 'get_profile',
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'List Templates',
						value: 'list_templates',
						description:
							'Browse the video template catalogue with supported formats and descriptions. Does not render or start a recording.',
						action: 'List templates in demovela',
					},
				],
				default: 'list_templates',
				displayOptions: {
					show: {
						resource: ['templates'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Video',
						value: 'get_video',
						description:
							'Read an existing owned video or draft by ID from List Videos. Download links require product sign-in. Does not start or poll rendering jobs',
						action: 'Get video in demovela',
					},
					{
						name: 'Get Video Status',
						value: 'get_video_status',
						description:
							'Read an existing owned video or draft by ID from List Videos. Download links require product sign-in. Does not start or poll rendering jobs',
						action: 'Get video status in demovela',
					},
					{
						name: 'List Videos',
						value: 'list_videos',
						description:
							'Browse existing outputs and saved video briefs in your workspace. An empty list means no saved videos or drafts.',
						action: 'List videos in demovela',
					},
				],
				default: 'get_video',
				displayOptions: {
					show: {
						resource: ['videos'],
					},
				},
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Video Draft',
						value: 'create_video_draft',
						description:
							'Save a brief and template as a draft conversation for review in Demovela. No recording, rendering or credit spending. Use a new UUID requestId per draft; reuse it only when retrying the exact same draft',
						action: 'Create video draft in demovela',
					},
				],
				default: 'create_video_draft',
				displayOptions: {
					show: {
						resource: ['video-drafts'],
					},
				},
			},
			{
				displayName: 'Request ID',
				name: 'create_video_draft__requestId',
				type: 'string',
				default: '',
				required: true,
				description: 'The request ID for this operation',
				displayOptions: {
					show: {
						operation: ['create_video_draft'],
						resource: ['video-drafts'],
					},
				},
			},
			{
				displayName: 'Title',
				name: 'create_video_draft__title',
				type: 'string',
				default: '',
				required: true,
				description: 'The title for this operation',
				displayOptions: {
					show: {
						operation: ['create_video_draft'],
						resource: ['video-drafts'],
					},
				},
			},
			{
				displayName: 'Brief',
				name: 'create_video_draft__brief',
				type: 'string',
				default: '',
				required: true,
				description: 'The brief for this operation',
				displayOptions: {
					show: {
						operation: ['create_video_draft'],
						resource: ['video-drafts'],
					},
				},
			},
			{
				displayName: 'Template ID',
				name: 'create_video_draft__templateId',
				type: 'string',
				default: '',
				required: true,
				description: 'The template ID for this operation',
				displayOptions: {
					show: {
						operation: ['create_video_draft'],
						resource: ['video-drafts'],
					},
				},
			},
			{
				displayName: 'Video ID',
				name: 'get_video__videoId',
				type: 'string',
				default: '',
				required: true,
				description: 'The video ID for this operation',
				displayOptions: {
					show: {
						operation: ['get_video'],
						resource: ['videos'],
					},
				},
			},
			{
				displayName: 'Video ID',
				name: 'get_video_status__videoId',
				type: 'string',
				default: '',
				required: true,
				description: 'The video ID for this operation',
				displayOptions: {
					show: {
						operation: ['get_video_status'],
						resource: ['videos'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						operation: ['list_videos'],
						resource: ['videos'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 1,
					numberPrecision: 0,
				},
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						operation: ['list_videos'],
						resource: ['videos'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						operation: ['list_templates'],
						resource: ['templates'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 1,
					numberPrecision: 0,
				},
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						operation: ['list_templates'],
						resource: ['templates'],
						returnAll: [false],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return executeOperations(
			this,
			'https://demovela.com',
			'demovelaOAuth2Api',
			operations as unknown as Operation[],
			routes as Record<string, ResourceRoute>,
		);
	}
}
