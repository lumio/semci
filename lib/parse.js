const validSemverTypes = [
  'build',
  'ci',
  'chore',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test'
];

const abbrTypes = {
  bugfix: 'fix',
  feature: 'feat',
};

const parse = {
  branchName: ( branchName, ignoreInvalidType = false ) => {
    const result = {
      isMain: false,
      isDevelop: false,
      name: branchName,
      type: '',
      issue: '',
      description: '',
    };

    if ( branchName === 'master' || branchName === 'main' ) {
      return {
        ...result,
        isMain: true,
      };
    }
    else if ( branchName === 'dev' || branchName === 'develop' ) {
      return {
        ...result,
        isDevelop: true,
      };
    }

    const [ branchType = '', name = '' ] = branchName.split( '/', 2 );
    let issue = '';
    let description = '';

    const match = name.match( /^(\w+\-\d+|\d+)(\-.+?)?$/ );
    if ( match && match[ 1 ] ) {
      issue = match[ 1 ];
      if ( issue.match( /^\d+$/ ) ) {
        issue = '#' + issue;
      }

      description = name.substring( issue.length + 1 );
    }

    const type = abbrTypes[ branchType ] || branchType;
    if ( !validSemverTypes.includes( type ) && !ignoreInvalidType ) {
      throw new Error( `Invalid semver type '${ type }'` );
    }

    return {
      ...result,
      type,
      issue,
      description,
    };
  },
};

module.exports = parse;
