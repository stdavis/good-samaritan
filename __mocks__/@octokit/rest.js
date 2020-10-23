class Octokit {
  constructor(auth) {
    this.token = auth;
    this.issues = {
      listForRepo: ({ owner }) => {
        const issues = {
          'stdavis': ['stdavis issues'],
          'asdavis': ['asdavis issues']
        };

        return issues[owner];
      }
    };
    this.paginate = (_, args) => {
      return this.issues.listForRepo(args);
    };
  }
}


module.exports = { Octokit };
