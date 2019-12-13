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
	TextControl,
	ToggleControl,
	SelectControl,
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

	const optionValues = options => options.map( option => option.value );

	const themeOptions = [
		{ value: 'standard', label: __( 'Standard (224 x 301 pixels)' ) },
		{ value: 'tall', label: __( 'Tall (288 x 490 pixels)' ) },
		{ value: 'wide', label: __( 'Wide (840 x 350 pixels)' ) },
		{ value: 'button', label: __( 'Button (210 x 113 pixels)' ) },
	];
	const themeValues = optionValues( themeOptions );

	const languageOptions = [
		{ value: 'en-US', label: __( 'English-US' ) },
		{ value: 'fr-CA', label: __( 'Français-CA' ) },
		{ value: 'de-DE', label: __( 'Deutsch-DE' ) },
		{ value: 'es-MX', label: __( 'Español-MX' ) },
		{ value: 'ja-JP', label: __( '日本語-JP' ) },
		{ value: 'nl-NL', label: __( 'Nederlands-NL' ) },
		{ value: 'it-IT', label: __( 'Italiano-IT' ) },
	];
	const languageValues = optionValues( languageOptions );

	const inspectorControls = () => (
		<InspectorControls>
			<PanelBody title={ __( 'Styles', 'jetpack' ) }></PanelBody>
			<PanelBody title={ __( 'Settings', 'jetpack' ) }>
				<TextControl
					label={ __( 'Restaurant ID' ) }
					type="text"
					value={ rid }
					onChange={ newRid => setAttributes( { rid: newRid } ) }
				/>
				<SelectControl
					label={ __( 'Widget Type' ) }
					value={ theme }
					onChange={ newTheme => setAttributes( { theme: newTheme } ) }
					options={ themeOptions }
				/>
				<ToggleControl
					label={ __( 'Load the widget in an iFrame (Recommended)' ) }
					checked={ iframe }
					onChange={ () => setAttributes( { iframe: ! iframe } ) }
				/>
				<SelectControl
					label={ __( 'Language', 'jetpack' ) }
					value={ lang }
					onChange={ newLang => setAttributes( { lang: newLang } ) }
					options={ languageOptions }
				/>
				<ToggleControl
					label={ __( 'Open in a new window' ) }
					checked={ newtab }
					onChange={ () => setAttributes( { newtab: ! newtab } ) }
				/>
			</PanelBody>
		</InspectorControls>
	);

	const renderPreview = () => (
		<>
			<div className={ `${ className }-overlay` }></div>
			<iframe
				title={ `Open Table Preview ${ clientId }` }
				src={ `https://www.opentable.com/widget/reservation/canvas?rid=${ rid }&type=${
					'button' === theme ? 'button' : 'standard'
				}&theme=${ theme }&overlay=false&domain=${ domain }&lang=${
					lang && languageValues.includes( lang ) ? lang : 'en-US'
				}&newtab=${ newtab }&disablega=true` }
			/>
		</>
	);

	const editClasses = classNames( className, {
		[ `${ className }-theme-${ theme }` ]: rid && themeValues.includes( theme ),
	} );

	return (
		<div className={ editClasses }>
			{ rid && inspectorControls() }
			{ rid ? inspectorControls() && renderPreview() : renderPlaceholder() }
		</div>
	);
}
