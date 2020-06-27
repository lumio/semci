import changeCase from 'change-case';
import git from '../lib/git';

const defaultType = 'feature';
const abbrTypes = {
  feat: 'feature',
  fix: 'bugfix',
};

const getBranchName = ( params ) => {
  let issue = changeCase.paramCase( params.issue || '' ).toUpperCase();
  const type = abbrTypes[ params.type ] || params.type || defaultType;
  const description = changeCase.paramCase( params.description || '' );

  if ( issue.substring( 0, 1 ) === '#' ) {
    issue = issue.substring( 1 );
  }

  return `${ type }/${ [ issue, description ].filter( Boolean ).join( '-' ) }`;
};

export default {
  new: ( params ) => {
    const branchName = getBranchName( params );
    return git( 'checkout', '-b', branchName );
  },

  rename: ( params ) => {
    const branchName = getBranchName( params );
    return git( 'branch', '-m', branchName );
  },
};
