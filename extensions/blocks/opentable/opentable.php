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
 * @param array  $attr    Array containing the Opentable block attributes.
 * @param string $content String containing the Opentable block content.
 *
 * @return string
 */
function jetpack_opentable_block_load_assets( $attr, $content ) {
	Jetpack_Gutenberg::load_assets_as_required( 'opentable' );
	return $content;
}
