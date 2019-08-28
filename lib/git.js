const runCommand = require( './runCommand' );
module.exports = ( ...args ) => runCommand( 'git', args, true );
