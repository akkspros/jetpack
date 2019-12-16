/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import icon from './icon';

/**
 * Style dependencies
 */
import './editor.scss';

export const name = 'opentable';
export const title = __( 'OpenTable', 'jetpack' );
export const settings = {
	title,

	description: __( 'Allow visitors to book a reservation with OpenTable', 'jetpack' ),

	icon,

	category: 'jetpack',

	keywords: [ 'opentable', 'reservation', 'restaurant' ],

	supports: {
		html: false,
	},

	edit,

	save: () => null,

	attributes: {
		rid: {
			default: [],
			type: 'array',
		},
		style: {
			default: 'standard',
			type: 'string',
		},
		iframe: {
			default: true,
			type: 'boolean',
		},
		domain: {
			default: 'com',
			type: 'string',
		},
		lang: {
			default: 'en-US',
			type: 'string',
		},
		newtab: {
			default: false,
			type: 'boolean',
		},
	},

	example: {
		attributes: {
			rid: '1',
			style: 'standard',
			iframe: true,
			domain: 'com',
			lang: 'en-US',
			newtab: false,
		},
	},
};
