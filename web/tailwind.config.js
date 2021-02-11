module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
		screens: {
			'print': {'raw': 'print'},
		},
        colors: {
          'red-primary': '#FC6171',
          'green-primary': '#1BB4BB',
		  'yellow-primary': '#FFC107',
		  'orange-primary': '#FF6600',
		  'blue-primary': '#043B6F',
		  'gray-primary': '#E0E0E0',
		  'purple-primary': '#9C00F7',
          'incorrect-red': '#FF002A',
          'correct-green': '#00FF43',
          'blue-250': '#3478B9',
		  'blue-200': '#F9F9F9',
		  'blue-150': '#3478B9',
		  'blue-100': '#7BACAE',
		  'blue-50': '#74ACED',
		  'red-250': '#FF9191',
		  'green-250': '#C6EFCE',
		  'yellow-250': '#FFEB9C',
		  'gray-100': '#EFF3F7',
		  'light-blue-primary': '#3478B9',
		  'black-primary': '#000000',
		  'gray-primary': '#808080'
        },
        width: (theme) => ({
          auto: 'auto',
          ...theme('spacing'),
          '1/7': '45%'
        }),
    },
  },
  variantOrder: [
		'first',
		'last',
		'odd',
		'even',
		'visited',
		'checked',
		'group-hover',
		'group-focus',
		'focus-within',
		'hover',
		'focus',
		'focus-visible',
		'active',
		'disabled',
	],
	variants: {
		accessibility: ['responsive', 'focus-within', 'focus'],
		alignContent: ['responsive'],
		alignItems: ['responsive'],
		alignSelf: ['responsive'],
		animation: ['responsive'],
		appearance: ['responsive'],
		backgroundAttachment: ['responsive'],
		backgroundClip: ['responsive'],
		backgroundColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus'],
		backgroundImage: ['responsive'],
		backgroundOpacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
		backgroundPosition: ['responsive'],
		backgroundRepeat: ['responsive'],
		backgroundSize: ['responsive'],
		borderCollapse: ['responsive'],
		borderColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus'],
		borderOpacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
		borderRadius: ['responsive'],
		borderStyle: ['responsive'],
		borderWidth: ['responsive'],
		boxShadow: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
		boxSizing: ['responsive'],
		clear: ['responsive'],
		container: ['responsive'],
		cursor: ['responsive'],
		display: ['responsive'],
		divideColor: ['responsive', 'dark'],
		divideOpacity: ['responsive'],
		divideStyle: ['responsive'],
		divideWidth: ['responsive'],
		fill: ['responsive'],
		flex: ['responsive'],
		flexDirection: ['responsive'],
		flexGrow: ['responsive'],
		flexShrink: ['responsive'],
		flexWrap: ['responsive'],
		float: ['responsive'],
		fontFamily: ['responsive'],
		fontSize: ['responsive'],
		fontSmoothing: ['responsive'],
		fontStyle: ['responsive'],
		fontVariantNumeric: ['responsive'],
		fontWeight: ['responsive'],
		gap: ['responsive'],
		gradientColorStops: ['responsive', 'dark', 'hover', 'focus'],
		gridAutoColumns: ['responsive'],
		gridAutoFlow: ['responsive'],
		gridAutoRows: ['responsive'],
		gridColumn: ['responsive'],
		gridColumnEnd: ['responsive'],
		gridColumnStart: ['responsive'],
		gridRow: ['responsive'],
		gridRowEnd: ['responsive'],
		gridRowStart: ['responsive'],
		gridTemplateColumns: ['responsive'],
		gridTemplateRows: ['responsive'],
		height: ['responsive'],
		inset: ['responsive'],
		justifyContent: ['responsive'],
		justifyItems: ['responsive'],
		justifySelf: ['responsive'],
		letterSpacing: ['responsive'],
		lineHeight: ['responsive'],
		listStylePosition: ['responsive'],
		listStyleType: ['responsive'],
		margin: ['responsive'],
		maxHeight: ['responsive'],
		maxWidth: ['responsive'],
		minHeight: ['responsive'],
		minWidth: ['responsive'],
		objectFit: ['responsive'],
		objectPosition: ['responsive'],
		opacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
		order: ['responsive'],
		outline: ['responsive', 'focus-within', 'focus'],
		overflow: ['responsive'],
		overscrollBehavior: ['responsive'],
		padding: ['responsive'],
		placeContent: ['responsive'],
		placeItems: ['responsive'],
		placeSelf: ['responsive'],
		placeholderColor: ['responsive', 'dark', 'focus'],
		placeholderOpacity: ['responsive', 'focus'],
		pointerEvents: ['responsive'],
		position: ['responsive'],
		resize: ['responsive'],
		ringColor: ['responsive', 'dark', 'focus-within', 'focus'],
		ringOffsetColor: ['responsive', 'dark', 'focus-within', 'focus'],
		ringOffsetWidth: ['responsive', 'focus-within', 'focus'],
		ringOpacity: ['responsive', 'focus-within', 'focus'],
		ringWidth: ['responsive', 'focus-within', 'focus'],
		rotate: ['responsive', 'hover', 'focus'],
		scale: ['responsive', 'hover', 'focus'],
		skew: ['responsive', 'hover', 'focus'],
		space: ['responsive'],
		stroke: ['responsive'],
		strokeWidth: ['responsive'],
		tableLayout: ['responsive'],
		textAlign: ['responsive'],
		textColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus'],
		textDecoration: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
		textOpacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
		textOverflow: ['responsive'],
		textTransform: ['responsive'],
		transform: ['responsive'],
		transformOrigin: ['responsive'],
		transitionDelay: ['responsive'],
		transitionDuration: ['responsive'],
		transitionProperty: ['responsive'],
		transitionTimingFunction: ['responsive'],
		translate: ['responsive', 'hover', 'focus'],
		userSelect: ['responsive'],
		verticalAlign: ['responsive'],
		visibility: ['responsive'],
		whitespace: ['responsive'],
		width: ['responsive'],
		wordBreak: ['responsive'],
		zIndex: ['responsive', 'focus-within', 'focus'],
	},
  // variants: {
  //   extend: {},
  // },
  plugins: [],
}
