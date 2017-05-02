export default userHelper = {
    auth: function () {
        let userToken = this.query.token.replace(/\s/g, '+');
        if (userToken) {
            let user = Meteor.users.findOne({
                'services.resume.loginTokens.hashedToken' : userToken
            });
            return user && user._id;
        }
    }
}