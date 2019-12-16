/**
 * External dependencies
 */
import { unionBy, throttle } from 'lodash';

/**
 * WordPress dependencies
 */
import { FormTokenField } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const MAX_SUGGESTIONS = 20;

export default function RestaurantPicker( props ) {
	const [ restaurants, setRestaurants ] = useState( [] );
	const [ selectedRestaurants, setSelectedRestaurants ] = useState( props.rids || [] );

	const idRegex = /^(\d+)$|\(\#(\d+)\)$/;

	const onChange = selected => {
		const selectedIds = selected.map( restaurant => {
			const parsed = idRegex.exec( restaurant );
			const selectedId = parsed[ 1 ] || parsed[ 2 ];

			return selectedId;
		} );
		setSelectedRestaurants( selectedIds );
		props.onChange && props.onChange( selectedIds );
	};

	const searchRestaurants = ( input = '' ) => {
		// TODO: Create cancellable fetch
		fetch(
			'https://www.opentable.com/widget/reservation/restaurant-search?pageSize=' +
				MAX_SUGGESTIONS +
				'&query=' +
				input
		)
			.then( result => result.json() )
			.then( restaurantResponse =>
				setRestaurants( unionBy( restaurants, restaurantResponse.items, 'rid' ) )
			);
	};

	const restaurantNames = restaurants.map(
		restaurant => restaurant.name + ` (#${ restaurant.rid })`
	);

	return (
		<FormTokenField
			value={ selectedRestaurants }
			suggestions={ restaurantNames }
			onChange={ onChange }
			onInputChange={ throttle( searchRestaurants, 500 ) }
			maxSuggestions={ MAX_SUGGESTIONS }
			label={ __( 'Restaurant ID' ) }
		/>
	);
}
