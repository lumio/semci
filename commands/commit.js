const prompts = require( 'prompts' );
const kleur = require( 'kleur' );
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
    parts.type && `${ parts.type }:`,
    parts.issue,
    parts.message,
  ].filter( Boolean ).join( ' ' );

  if ( !parts.type ) {
    const response = await prompts( {
      type: 'confirm',
      name: 'confirm',
      message: 'Your commit message has no type! Do you want to commit it without it?\n'
        + `The message would be: ${ kleur.reset().yellow( `"${ commitMessage }"` ) }`,
      initial: true,
    } );

    if ( !response.confirm ) {
      return 1;
    }
  }

  const args = [
    'commit',
    params.all && '-a',
    '-m',
    commitMessage,
  ].filter( Boolean );

  return git.apply( null, args );
};
