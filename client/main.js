
_ = require('lodash');

import '/imports/ui/app/Main';


// Initialize email verification
delete Accounts._accountsCallbacks['verify-email'];
Accounts.onEmailVerificationLink(function (token, done) {                                                              // 18
    Accounts.verifyEmail(token, function (error) {                                                                       // 19
        done();                                                                                                            // 24         // 25
    });                                                                                                                  // 26
});

// Initialize email reset password link
Accounts.onResetPasswordLink(function (token, done) {                                                              // 18
                                                                                                           // 26
});
