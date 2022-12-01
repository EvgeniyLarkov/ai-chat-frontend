const plugins = [];

if (process.env.NODE_ENV === 'development') {
	plugins.push('react-refresh/babel');
	plugins.push('@babel/plugin-proposal-class-properties');
}

module.exports = {
	presets: ['@babel/preset-env', '@babel/preset-react'],
	assumptions: {
		setPublicClassFields: false,
	},
	plugins,
};
