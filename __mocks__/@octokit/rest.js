class Octokit {
  constructor(auth) {
    this.token = auth;
    this.issues = {
      listForRepo: ({ owner }) => {
        const issues = {
          'stdavis': ['stdavis issues'],
          'asdavis': ['asdavis issues']
        };

        return {
          data: issues[owner]
        };
      }
    };
  }
}


module.exports = { Octokit };
