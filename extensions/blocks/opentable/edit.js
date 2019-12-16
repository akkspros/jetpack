/**
 * External dependencies
 */
import classnames from 'classnames';
import { compact, isEmpty, join } from 'lodash';

/**
 * WordPress dependencies
 */
import { BlockControls, BlockIcon, InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	ExternalLink,
	Notice,
	PanelBody,
	Placeholder,
	SelectControl,
	TextareaControl,
	ToggleControl,
	Toolbar,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';
import RestaurantPicker from './restaurant-picker';

export default function OpentableEdit( {
	attributes: { rid, style, iframe, domain, lang, newtab },
	setAttributes,
	className,
	clientId,
} ) {
	const [ embedCode, setEmbedCode ] = useState();
	const [ notice, setNotice ] = useState();

	const setErrorNotice = () =>
		setNotice(
			<>
				<strong>{ __( 'We ran into an issue', 'jetpack' ) }</strong>
				<br />
				{ __( 'Please ensure this embed matches the one from your OpenTable account', 'jetpack' ) }
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
		let styleSetting = searchParams.get( 'theme' );
		if ( searchParams.get( 'type' ) === 'button' ) {
			styleSetting = searchParams.get( 'type' );
		}

		setAttributes( {
			rid: searchParams.getAll( 'rid' ),
			iframe: Boolean( searchParams.get( 'iframe' ) ),
			domain: searchParams.get( 'domain' ),
			lang: searchParams.get( 'lang' ),
			newtab: Boolean( searchParams.get( 'newtab' ) ),
			style: styleSetting,
		} );
	};

	const optionValues = options => options.map( option => option.value );

	const styleOptions = compact( [
		{ value: 'standard', label: __( 'Standard (224 x 301 pixels)', 'jetpack' ) },
		{ value: 'tall', label: __( 'Tall (288 x 490 pixels)', 'jetpack' ) },
		{ value: 'wide', label: __( 'Wide (840 x 350 pixels)', 'jetpack' ) },
		rid.length <= 1 && { value: 'button', label: __( 'Button (210 x 113 pixels)', 'jetpack' ) },
	] );
	const styleValues = optionValues( styleOptions );

	const languageOptions = [
		{ value: 'en-US', label: __( 'English-US', 'jetpack' ) },
		{ value: 'fr-CA', label: __( 'Français-CA', 'jetpack' ) },
		{ value: 'de-DE', label: __( 'Deutsch-DE', 'jetpack' ) },
		{ value: 'es-MX', label: __( 'Español-MX', 'jetpack' ) },
		{ value: 'ja-JP', label: __( '日本語-JP', 'jetpack' ) },
		{ value: 'nl-NL', label: __( 'Nederlands-NL', 'jetpack' ) },
		{ value: 'it-IT', label: __( 'Italiano-IT', 'jetpack' ) },
	];
	const languageValues = optionValues( languageOptions );

	const embedCodeForm = (
		<form onSubmit={ parseEmbedCode }>
			<TextareaControl
				onChange={ value => setEmbedCode( value ) }
				placeholder={ __( 'Paste your OpenTable embed code here…' ) }
			>
				{ embedCode }
			</TextareaControl>
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
	);

	const updateStyle = newStyle => {
		setAttributes( { style: newStyle } );
	};

	const getTypeAndTheme = fromStyle =>
		rid.length > 1
			? [ 'multi', 'button' !== fromStyle ? fromStyle : 'standard' ]
			: [
					'button' === fromStyle ? 'button' : 'standard',
					'button' === fromStyle ? 'standard' : fromStyle,
			  ];

	const blockPreview = styleOveride => {
		const [ type, theme ] = getTypeAndTheme( styleOveride ? styleOveride : style );
		return (
			<>
				<div className={ `${ className }-overlay` }></div>
				<iframe
					title={ `Open Table Preview ${ clientId }` }
					src={ `https://www.opentable.com/widget/reservation/canvas?rid=${ join(
						rid,
						'%2C'
					) }&type=${ type }&theme=${ theme }&overlay=false&domain=${ domain }&lang=${
						lang && languageValues.includes( lang ) ? lang : 'en-US'
					}&newtab=${ newtab }&disablega=true` }
				/>
			</>
		);
	};

	const blockControls = (
		<BlockControls>
			{ ! isEmpty( rid ) && (
				<Toolbar
					isCollapsed={ true }
					icon="edit"
					label={ __( 'Type' ) }
					controls={ styleOptions.map( styleOption => ( {
						title: styleOption.label,
						isActive: styleOption.value === style,
						onClick: () => updateStyle( styleOption.value ),
					} ) ) }
				/>
			) }
		</BlockControls>
	);

	const restaurantPicker = (
		<RestaurantPicker
			onChange={ newRids =>
				setAttributes( {
					rid: newRids,
					style: newRids.length > 1 && 'button' === style ? 'standard' : style,
				} )
			}
			rids={ rid }
		/>
	);

	const inspectorControls = () => (
		<InspectorControls>
			<PanelBody title={ __( 'Styles', 'jetpack' ) }>
				<div className="block-editor-block-styles">
					{ styleOptions.map( styleOption => {
						return (
							<div
								key={ styleOption.value }
								className={ classnames( 'block-editor-block-styles__item is-opentable', {
									'is-active': styleOption.value === style,
								} ) }
								onClick={ () => updateStyle( styleOption.value ) }
								onKeyDown={ event => {
									if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
										event.preventDefault();
										updateStyle( styleOption.value );
									}
								} }
								role="button"
								tabIndex="0"
								aria-label={ styleOption.label }
							>
								<div className="block-editor-block-styles__item-preview is-opentable">
									{ blockPreview( styleOption.value ) }
								</div>
								<div className="block-editor-block-styles__item-label">{ styleOption.label }</div>
							</div>
						);
					} ) }
				</div>
			</PanelBody>
			<PanelBody title={ __( 'Settings', 'jetpack' ) }>
				{ restaurantPicker }
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
			<PanelBody title={ __( 'Embed code', 'jetpack' ) } initialOpen={ false }>
				{ embedCodeForm }
			</PanelBody>
		</InspectorControls>
	);

	const blockPlaceholder = (
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
			{ restaurantPicker }
			{ embedCodeForm }
		</Placeholder>
	);

	const editClasses = classnames( className, {
		[ `${ className }-theme-${ style }` ]: rid && styleValues.includes( style ),
	} );

	return (
		<div className={ editClasses }>
			{ ! isEmpty( rid ) && (
				<>
					{ inspectorControls() }
					{ blockControls }
				</>
			) }
			{ ! isEmpty( rid ) ? blockPreview() : blockPlaceholder }
		</div>
	);
}
