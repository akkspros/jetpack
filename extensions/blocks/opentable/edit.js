/**
 * External dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Placeholder } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';

export default function OpentableEdit( { setAttributes } ) {
	const [ embedCode, setEmbedCode ] = useState();
	const renderPlaceholder = () => {
		const notices = null;
		const preview = null;

		const parseEmbedCode = event => {
			if ( ! event ) {
				return;
			}

			event.preventDefault();

			const scriptTagAttributes = embedCode.match( /< *script[^>]*src *= *["']?([^"']*)/i );
			if ( ! scriptTagAttributes[ 1 ] ) {
				return;
			}

			let src = '';
			if ( scriptTagAttributes[ 1 ].indexOf( 'http' ) === 0 ) {
				src = new URL( scriptTagAttributes[ 1 ] );
			} else {
				src = new URL( 'http:' + scriptTagAttributes[ 1 ] );
			}

			if ( ! src.search ) {
				return;
			}

			const searchParams = new URLSearchParams( src.search );

			setAttributes( {
				rid: searchParams.get( 'rid' ),
				type: searchParams.get( 'type' ),
				theme: searchParams.get( 'theme' ),
				iframe: searchParams.get( 'iframe' ),
				domain: searchParams.get( 'domain' ),
				lang: searchParams.get( 'lang' ),
				newtab: searchParams.get( 'newtab' ),
			} );
		};

		return (
			<Placeholder
				label="OpenTable"
				instructions={ __( 'Paste your embed code' ) }
				notices={ notices }
				preview={ preview }
			>
				<form onSubmit={ parseEmbedCode }>
					<textarea name="test" onChange={ event => setEmbedCode( event.target.value ) }></textarea>
					<Button isLarge type="submit">
						{ _x( 'Embed', 'button label', 'jetpack' ) }
					</Button>
				</form>
			</Placeholder>
		);
	};

	return renderPlaceholder();
}
