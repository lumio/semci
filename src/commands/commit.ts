import prompts from 'prompts';
import kleur from 'kleur';
import git from '../lib/git';
import parse from '../lib/parse';
import log from '../lib/log';

const sanitizeIssueNum = ( issue ) => {
  const num = parseInt( issue, 10 );

  if ( num.toString() === issue && issue !== 'NaN' ) {
    return `#${ issue }`;
  }

  return issue;
}

export default async ( params ) => {
  const branchName = await git.getBranchName();
  const parsedBranchName = parse.branchName( branchName, params.ignoreInvalidType );

  const parts = {
    issue: params.issue || parsedBranchName.issue,
    type: params.type || parsedBranchName.type || '',
    message: params.message,
  };

  if ( parsedBranchName.isMain || parsedBranchName.isDevelop ) {
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
    parts.type = `${ type }(${ scopedTypeParts.join( ' ' ) })`;
  }

  const commitMessage = [
    parts.type && `${ parts.type }:`,
    sanitizeIssueNum( parts.issue ),
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
