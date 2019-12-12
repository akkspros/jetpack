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

export default function OpentableEdit() {
	const [ embedCode, setEmbedCode ] = useState();
	const renderPlaceholder = () => {
		const notices = null;
		const preview = null;

		const parseEmbedCode = event => {
			if ( ! event ) {
				return;
			}

			event.preventDefault();

			console.log( embedCode );
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
