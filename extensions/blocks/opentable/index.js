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

	attributes: {
		rid: {
			type: 'string',
		},
		type: {
			type: 'string',
		},
		theme: {
			type: 'string',
		},
		iframe: {
			type: 'string',
		},
		domain: {
			type: 'string',
		},
		lang: {
			type: 'string',
		},
		newtab: {
			type: 'string',
		},
	},
};
