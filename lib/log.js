const kleur = require( 'kleur' );

function log( msg ) {
  console.log( kleur.gray( msg ) );
}
log.warn = ( msg ) => console.log( kleur.yellow( 'Warning! ' ) + msg );

module.exports = log;
