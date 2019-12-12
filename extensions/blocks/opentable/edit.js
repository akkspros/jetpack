/**
 * External dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BlockIcon } from '@wordpress/block-editor';
import { Button, Notice, Placeholder } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';

export default function OpentableEdit( { attributes: { rid }, setAttributes } ) {
	const [ embedCode, setEmbedCode ] = useState();
	const [ notice, setNotice ] = useState();
	const renderPlaceholder = () => {
		const setErrorNotice = () =>
			setNotice(
				<>
					<strong>{ __( 'We ran into an issue', 'jetpack' ) }</strong>
					<br />
					{ __(
						'Please ensure this embed matches the one from your OpenTable account',
						'jetpack'
					) }
				</>
			);

		const parseEmbedCode = event => {
			if ( ! event ) {
				setErrorNotice();
				return;
			}

			event.preventDefault();

			if ( ! embedCode ) {
				setErrorNotice();
				return;
			}

			const scriptTagAttributes = embedCode.match( /< *script[^>]*src *= *["']?([^"']*)/i );
			if ( ! scriptTagAttributes || ! scriptTagAttributes[ 1 ] ) {
				setErrorNotice();
				return;
			}

			let src = '';
			if ( scriptTagAttributes[ 1 ].indexOf( 'http' ) === 0 ) {
				src = new URL( scriptTagAttributes[ 1 ] );
			} else {
				src = new URL( 'http:' + scriptTagAttributes[ 1 ] );
			}

			if ( ! src.search ) {
				setErrorNotice();
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
				icon={ <BlockIcon icon={ icon } /> }
				instructions={ __( 'Paste your embed code' ) }
				notices={
					notice && (
						<Notice status="error" isDismissible={ false }>
							{ notice }
						</Notice>
					)
				}
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

	return rid ? rid : renderPlaceholder();
}
