/**
 * External dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { Component, useState } from '@wordpress/element';
import { Button, Placeholder } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';

export default function OpentableEdit( { attributes, setAttributes } ) {
	const renderPlaceholder = () => {
		/*const {
			allowedTypes = [],
			className,
			icon,
			isAppender,
			labels = {},
			onDoubleClick,
			mediaPreview,
			notices,
			onSelectURL,
			mediaUpload,
			children,
		} = this.props;
	
		let instructions = labels.instructions;
		let title = labels.title;
	
		if ( ! mediaUpload && ! onSelectURL ) {
			instructions = __( 'To edit this block, you need permission to upload media.' );
		}
	
		if ( instructions === undefined || title === undefined ) {
			const isOneType = 1 === allowedTypes.length;
			const isAudio = isOneType && 'audio' === allowedTypes[ 0 ];
			const isImage = isOneType && 'image' === allowedTypes[ 0 ];
			const isVideo = isOneType && 'video' === allowedTypes[ 0 ];
	
			if ( instructions === undefined && mediaUpload ) {
				instructions = __( 'Upload a media file or pick one from your media library.' );
	
				if ( isAudio ) {
					instructions = __( 'Upload an audio file, pick one from your media library, or add one with a URL.' );
				} else if ( isImage ) {
					instructions = __( 'Upload an image file, pick one from your media library, or add one with a URL.' );
				} else if ( isVideo ) {
					instructions = __( 'Upload a video file, pick one from your media library, or add one with a URL.' );
				}
			}
	
			if ( title === undefined ) {
				title = __( 'Media' );
	
				if ( isAudio ) {
					title = __( 'Audio' );
				} else if ( isImage ) {
					title = __( 'Image' );
				} else if ( isVideo ) {
					title = __( 'Video' );
				}
			}
		}
	
		const placeholderClassName = classnames(
			'block-editor-media-placeholder',
			'editor-media-placeholder',
			className,
			{ 'is-appender': isAppender }
		);
		
						icon={ icon }
					{ cannotEmbed && (
						<p className="components-placeholder__error">
							{ __( 'Sorry, this content could not be embedded.', 'jetpack' ) }
							<br />
							<Button isLarge onClick={ () => fallback( editedUrl, this.props.onReplace ) }>
								{ _x( 'Convert to link', 'button label', 'jetpack' ) }
							</Button>
						</p>
					) }

		*/

		const notices = null;
		const preview = null;

		const parseEmbedCode = event => {
			if ( ! event ) {
				return;
			}

			event.preventDefault();

			console.log( event );
		};

		return (
			<Placeholder
				label="OpenTable"
				instructions={ __( 'Paste your embed code' ) }
				notices={ notices }
				preview={ preview }
			>
				<form onSubmit={ parseEmbedCode }>
					<textarea
						name="test"
						onChange={ event => this.setState( { editedUrl: event.target.value } ) }
					></textarea>
					<Button isLarge type="submit">
						{ _x( 'Embed', 'button label', 'jetpack' ) }
					</Button>
				</form>
			</Placeholder>
		);
	};

	return renderPlaceholder();
}
