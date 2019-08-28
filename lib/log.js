const kleur = require( 'kleur' );

function log( msg ) {
  console.log( kleur.gray( msg ) );
}
log.warn = ( msg ) => console.log( kleur.yellow( 'Warning! ' ) + msg );
log.error = ( msg ) => console.error( kleur.red( 'Error! ' ) + msg );

module.exports = log;
