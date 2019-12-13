/**
 * External dependencies
 */
import { BlockIcon, InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	ExternalLink,
	Notice,
	PanelBody,
	Placeholder,
	TextareaControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';

export default function OpentableEdit( {
	attributes: { rid, theme, iframe, domain, lang, newtab },
	setAttributes,
	className,
	clientId,
} ) {
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
				iframe: Boolean( searchParams.get( 'iframe' ) ),
				domain: searchParams.get( 'domain' ),
				lang: searchParams.get( 'lang' ),
				newtab: Boolean( searchParams.get( 'newtab' ) ),
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
						onChange={ value => setEmbedCode( value ) }
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

	const inspectorControls = () => (
		<InspectorControls>
			<PanelBody title={ __( 'Styles', 'jetpack' ) }></PanelBody>
			<PanelBody title={ __( 'Settings', 'jetpack' ) }>
				rid:{' '}
				<input
					type="text"
					value={ rid }
					onBlur={ event => setAttributes( { rid: event.target.value } ) }
				/>
				<br />
				theme:
				<select
					defaultValue={ theme }
					onBlur={ event => setAttributes( { theme: event.target.value } ) }
				>
					<option value="standard">Standard (224 x 301 pixels)</option>
					<option value="tall">Tall (288 x 490 pixels)</option>
					<option value="wide">Wide (840 x 350 pixels)</option>
					<option value="button">Button (210 x 113 pixels)</option>
				</select>
				<br />
				iframe:{' '}
				<input
					type="checkbox"
					checked={ iframe }
					onBlur={ () => setAttributes( { iframe: ! iframe } ) }
				/>
				<br />
				{ __( 'Language', 'jetpack' ) }:
				<select
					defaultValue={ lang }
					onBlur={ event => setAttributes( { lang: event.target.value } ) }
				>
					<option value="en-US">English-US</option>
					<option value="fr-CA">Français-CA</option>
					<option value="de-DE">Deutsch-DE</option>
					<option value="es-MX">Español-MX</option>
					<option value="ja-JP">日本語-JP</option>
					<option value="nl-NL">Nederlands-NL</option>
					<option value="it-IT">Italiano-IT</option>
				</select>
				<br />
				newtab:{' '}
				<input
					type="checkbox"
					checked={ newtab }
					onBlur={ () => setAttributes( { newtab: ! newtab } ) }
				/>
				<br />
			</PanelBody>
		</InspectorControls>
	);

	const renderPreview = () => (
		<>
			<div className={ `${ className }-overlay` }></div>
			<iframe
				title={ `Open Table Preview ${ clientId }` }
				src={ `https://www.opentable.com/widget/reservation/canvas?rid=${ rid }&type=standard&theme=${ theme }&overlay=false&domain=${ domain }&lang=${ lang }&newtab=${ newtab }&disablega=true` }
			/>
		</>
	);

	const editClasses = classNames( className, {
		[ `${ className }-theme-${ theme }` ]:
			rid && [ 'tall', 'wide', 'button', 'standard' ].includes( theme ),
	} );

	return (
		<div className={ editClasses }>
			{ rid && inspectorControls() }
			{ rid ? inspectorControls() && renderPreview() : renderPlaceholder() }
		</div>
	);
}
