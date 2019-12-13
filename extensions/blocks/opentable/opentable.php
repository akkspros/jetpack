<?php
/**
 * Opentable Block.
 *
 * @since 8.x
 *
 * @package Jetpack
 */

if ( jetpack_opentable_block_is_available() ) {
	jetpack_register_block(
		'jetpack/opentable',
		array( 'render_callback' => 'jetpack_opentable_block_load_assets' )
	);
} else {
	Jetpack_Gutenberg::set_extension_unavailable(
		'jetpack/opentable',
		'missing_plan',
		array(
			'required_feature' => 'opentable',
			'required_plan'    => ( defined( 'IS_WPCOM' ) && IS_WPCOM ) ? 'value_bundle' : 'jetpack_premium',
		)
	);
}

/**
 * Is the OpenTable block available on a given site
 *
 * @return bool True if the block is available, false otherwise.
 */
function jetpack_opentable_block_is_available() {
	// For WPCOM sites.
	if ( defined( 'IS_WPCOM' ) && IS_WPCOM && function_exists( 'has_any_blog_stickers' ) ) {
		$site_id = jetpack_get_blog_id();
		return has_any_blog_stickers( array( 'premium-plan', 'business-plan', 'ecommerce-plan' ), $site_id );
	}
	// For all Jetpack sites.
	return Jetpack::is_active() && Jetpack_Plan::supports( 'opentable' );
}

/**
 * Get the current blog ID
 *
 * @return int The current blog ID
 */
function jetpack_opentable_block_get_blog_id() {
	if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
		return get_current_blog_id();
	}
	return Jetpack_Options::get_option( 'id' );
}

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
