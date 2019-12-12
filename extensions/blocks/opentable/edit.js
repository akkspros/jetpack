/**
 * External dependencies
 */
import { BlockIcon } from '@wordpress/block-editor';
import { Button, ExternalLink, Notice, Placeholder, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';

export default function OpentableEdit( { attributes: { rid }, setAttributes, className } ) {
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
				label={ __( 'OpenTable Reservation', 'jetpack' ) }
				icon={ <BlockIcon icon={ icon } /> }
				notices={
					notice && (
						<Notice status="error" isDismissible={ false }>
							{ notice }
						</Notice>
					)
				}
			>
				<form onSubmit={ parseEmbedCode }>
					<TextareaControl
						onChange={ event => setEmbedCode( event.target.value ) }
						placeholder={ __( 'Paste your OpenTable embed code here…' ) }
					></TextareaControl>
					<Button isLarge type="submit">
						{ _x( 'Embed', 'button label', 'jetpack' ) }
					</Button>
					<p>
						<ExternalLink
							href="https://en.support.wordpress.com/widgets/open-table-widget/"
							target="_blank"
						>
							{ __( 'Need help finding your embed code?' ) }
						</ExternalLink>
					</p>
				</form>
			</Placeholder>
		);
	};

	return <div className={ className }>{ rid ? rid : renderPlaceholder() }</div>;
}
