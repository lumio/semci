const parse = {
  branchName: ( branchName ) => {
    const abbrTypes = {
      bugfix: 'fix',
      feature: 'feat',
    };

    const result = {
      isMaster: false,
      isDevelop: false,
      name: branchName,
      type: '',
      issue: '',
      description: '',
    };

    if ( branchName === 'master' ) {
      return {
        ...result,
        isMaster: true,
      };
    }
    else if ( branchName === 'dev' || branchName === 'develop' ) {
      return {
        ...result,
        isDevelop: true,
      };
    }

    const [ type, name ] = branchName.split( '/', 2 );
    let issue = '';
    let description = '';

    const match = name.match( /^(\w+\-\d+|\d+)\-/ );
    if ( match && match[ 1 ] ) {
      issue = match[ 1 ];
      if ( issue.match( /^\d+$/ ) ) {
        issue = '#' + issue;
      }

      description = name.substring( issue.length + 1 );
    }

    return {
      ...result,
      type: abbrTypes[ type ] || type,
      issue,
      description,
    };
  },
};

module.exports = parse;
