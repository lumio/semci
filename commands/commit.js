const git = require( '../lib/git' );
const parse = require( '../lib/parse' );
const log = require( '../lib/log' );

module.exports = async ( params ) => {
  const branchName = await git.getBranchName();
  const parsedBranchName = parse.branchName( branchName );

  const parts = {
    issue: params.issue || parsedBranchName.issue,
    type: params.type || parsedBranchName.type || '',
    message: params.message,
  };

  if ( parsedBranchName.isMaster || parsedBranchName.isDevelop ) {
    log.warn( `You're on ${ branchName }!` );
  }
  else if ( !parts.issue ) {
    log.warn( 'No issue number!' );
  }
  else if ( !parts.message ) {
    throw new Error( 'No commit message given' );
  }

  const scopedTypeParts = parts.type.split( ' ' );
  if ( scopedTypeParts.length > 1 && parts.type.indexOf( '(' ) === -1 ) {
    const type = scopedTypeParts.splice( 0, 1 ).join( '' );
    parts.type = `${type}(${ scopedTypeParts.join( ' ' ) })`;
  }

  const commitMessage = [
    `${ parts.type }:`,
    parts.issue,
    parts.message,
  ].filter( Boolean ).join( ' ' );

  const args = [
    'commit',
    params.all && '-a',
    '-m',
    commitMessage,
  ].filter( Boolean );

  return git.apply( null, args );
};
