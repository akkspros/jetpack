<?php
/**
 * Opentable Block.
 *
 * @since 8.x
 *
 * @package Jetpack
 */

jetpack_register_block(
	'jetpack/opentable',
	array( 'render_callback' => 'jetpack_opentable_block_load_assets' )
);

/**
 * Opentable block registration/dependency declaration.
 *
 * @param array $attributes    Array containing the Opentable block attributes.
 *
 * @return string
 */
function jetpack_opentable_block_load_assets( $attributes ) {
	Jetpack_Gutenberg::load_assets_as_required( 'opentable' );

	return '<script type="text/javascript" src="' . esc_url( jetpack_opentable_build_embed_url( $attributes ) ) . '"></script>';
}

/**
 * Build an embed URL from an array of URL values.
 *
 * @param array $attributes Array of URL values.
 *
 * @return string Embed URL
 */
function jetpack_opentable_build_embed_url( $attributes ) {
	return add_query_arg(
		array(
			'rid'    => $attributes['rid'],
			'type'   => $attributes['type'],
			'theme'  => $attributes['theme'],
			'iframe' => $attributes['iframe'],
			'domain' => $attributes['domain'],
			'lang'   => $attributes['lang'],
			'newtab' => $attributes['newtab'],
		),
		'//www.opentable.com/widget/reservation/loader'
	);
}
