import kleur from 'kleur';
import prompts from 'prompts';
import escapeStringRegexp from 'escape-string-regexp';
import git from '../lib/git';
import log from '../lib/log';

const selectBranch = async ( branches, pattern ) => {
  if ( branches.length === 1 && branches[ 0 ].name === pattern ) {
    return branches[ 0 ].name;
  }

  const { branch } = await prompts( [
    {
      type: 'select',
      name: 'branch',
      message: 'Select branch',
      choices: branches.map( branch => (
        {
          title: ( branch.active ? '* ' : '  ' ) + branch.name,
          value: branch.name,
        }
      ) ),
    },
  ] );

  return branch;
};

const checkoutNewBranch = async ( branches, newBranch ) => {
  if ( branches.find( b => b.name === newBranch ) ) {
    log.error( `A branch named ${ kleur.yellow( `'${ newBranch }'` ) } already exists.` );
    return 1;
  }

  return git( 'checkout', '-b', newBranch );
};

export default async ( { branch, newBranch } ) => {
  const branches = await git.getAllBranches();
  let possibleBranches = branches;

  if ( newBranch ) {
    return checkoutNewBranch( branches, branch );
  }

  if ( branch ) {
    const pattern = new RegExp( escapeStringRegexp( branch ), 'i' );
    possibleBranches = branches.filter( item => item?.name?.match( pattern ) );
  }

  if ( !possibleBranches.length ) {
    log.error( 'No branches found that match pattern!' );
    return 1;
  }

  const selectedBranch = await selectBranch( possibleBranches, branch );
  if ( !selectedBranch ) {
    return 1;
  }

  return git( 'checkout', selectedBranch );
};
