const changeCase = require( 'change-case' );
const git = require( '../lib/git' );

const defaultType = 'feature';
const abbrTypes = {
  feat: 'feature',
  fix: 'bugfix',
};

const getBranchName = ( params ) => {
  const issue = changeCase.paramCase( params.issue || '' ).toUpperCase();
  const type = abbrTypes[ params.type ] || params.type || defaultType;
  const description = changeCase.paramCase( params.description || '' );

  return `${ type }/${ [ issue, description ].filter( a => !!a ).join( '-' ) }`;
};

module.exports = {
  new: ( params ) => {
    const branchName = getBranchName( params );
    return git( 'checkout', '-b', branchName );
  },

  rename: ( params ) => {
    throw new Error( 'not implemented yet' );
  },
};
