Lang = {
    getDefaultLang: function() {
        return 'us';
    },
    strings: {
        'us_US': {
            // Here starts string declarations //////////////////////////////
            general: {
                latestsafari: '<a target="_blank" style="font-size:11px;float:right;" href="https://developer.apple.com/safari/download/">Get latest Safari browser</a>',
                notfound: 'Record not found',
                deletetitle: 'Confirm delete',
                deleteconfirm: 'Are you sure?',
                btnsave: 'Save',
                btncancel: 'Cancel',
                name: 'Name',
                notes: 'Notes',
                owner: 'Owner',
                publish: 'Published',
                information: 'Information',
                statistics: 'Statistics',
                action: 'Actions',
                productcategory: 'Product category',
                ctg: 'Category',
                createdat: 'Created at',
                updatedat: 'Updated at',
                lastsyncat: 'Last sync at',
                tags: 'Tags',
                excelexport: 'Export to excel',
                viewdata: 'View data',
                iqyfile: 'Download excel query file',
                url: 'URL',
                variables: 'Variables',
                server: 'Server',
                path: 'Path',

                crawlerserver: 'Crawler server',
                dataserver: 'Data server',
                datapath: 'Data path',
                filecontains: 'File name contains',
                fileexclude: 'File name excludes',
                dircontains: 'Directory name contains',
                direxclude: 'Directory name excludes',
                steptag: 'Step tag',
                replaceexisting: 'Replace existing'
            },
            login: {
                title: 'Please Login',
                email: 'E-mail',
                password: 'Password',
                login: 'Login',
                register: 'Don\'t have an account. Create one now!',
                forgot: 'Forgot password?',
                logout: 'Logout',
            },
            forgot: {
                title: 'Forgot password?',
                email: 'E-mail',
                text: 'Please enter your email to reset password',
                button: 'Reset',
                remember: 'Remembered it? login here',
                emailsent: 'Email with password reset link sent'
            },
            register: {
                title: 'Register',
                email: 'E-mail',
                username: 'User name',
                password: 'Password',
                verify: 'Verified',
                notequal: 'Passwords do not match',
                pwdshort: 'Password should be at least 6 characters long',
                emailsent: 'Verification email is sent',
                button: 'Register',
                login: 'Already have an account? Login here',
                lastlogin: 'Last logged in at',
                firstname: 'First name',
                lastname: 'Last name',
                company: 'Company',
                applicationroles: 'User application roles',
                dataroles: 'User data roles'
            },
            reset: {
                title: 'Reset password',
                password: 'Enter new password',
                button: 'Set password',
                passwordset: 'Password set successfully'
            },

            navig: {
                secure: 'Secure',
                visualizer: 'Charts',
                genealogy: 'History',
                workflow: 'Workflows',
                personnel: 'Personnel',
                settings: 'Settings',
                exporter: 'Get data',
                domain: 'Domain',
                myaccount: 'Logout',
                help: 'Help',

                exporterdetail: 'Report',
                _new_: 'to be added'
            },

            exporter: {
                masterviewtitle: 'Selected exporter details',
                searchtext: 'search exporters',
                filterctg: 'filter by category',
                actionsbutton: 'Actions',
                addbutton: 'Add',
                deletebutton: 'Delete',
                duplicatebutton: 'Duplicate',
                onlymybox: 'Only my exporters',
                lastrunat: 'Last run at',
                runs: '# of runs',
                runtime: 'Run time [sec]',
                exceltemplate: 'Upload excel template',
                addlinkeddata: 'Add data page',
                addlinks: 'Link data pages',
                addexporter: 'Add exporter',
                selectctg: 'Select category',
                searchtextvariables: 'search variables',
                emptyexceltext: 'select file from drive',
                excellabel: 'Excel file',
                uploadsuccess: 'Excel upload completed',
                filtererrormsg: 'Filter field is not properly formatted.',
                filtererrortitle: 'Filter error',
                nodatatitle: 'No data returned',
                copyurltoclipbaord: 'Copy URL to clipboard',
                iqyhelp: '<div style="padding-left:20px;"><b>Import data defined by selected report directly to Excel</b></div>' +
                '<ul><li>Be sure to select "download file" instead of "open with Excel"</li>' +
                '<li>Save the file in your local folder</li>' +
                '<li>Open new excel spreadsheet</li>' +
                '<li>Click on Data > Get External Data > Run Saved Query</li>' +
                '<li>Select or browse for the IQY file you downloaded</li>' +
                '<li>At first prompt, if not already selected, choose where you want the data to appear</li>' +
                '<li>Click "properties..." and in sub-prompt:<br/>' +
                '- CHECK  Save query definition<br/>' +
                '- CHECK  Enable background refresh<br/>' +
                '- CHECK  Refresh data when opening file<br/>' +
                '- CHECK  Overwrite existings cells with new data, clear unused cells<br/>' +
                '<li>To refresh all queries, press Data > Refresh All</li>' +
                '<li>Save excel file and use it to get data in the future</li>' +
                '</li></ul>'
            },
            visualizer: {
                searchtexttree: 'Search steps and workcenters',
                searchunits: 'Search units',
                masterviewtitle: 'Visualizer view',
                mastertreetitle: 'Visualizer steps'
            },
            genealogy: {
                unithistory: 'Unit history',
                masterviewtitle: 'Selected steps data'
            },
            domain: {
                user: 'Users',
                adddatarole: 'Add data role',
                ruletag: 'Tag rule',
                rulefilter: 'Filter rule',
                selecteduser: 'Selected user data',
                usersearchrole: 'Search data roles',
                usertitlerole:  'Data roles',
                usersearchgrid: 'Search users',
                filemeta: 'File crawler',
                filemetasearch: 'Search file crawlers',
                filemetaadd: 'Add file crawler',
                variable: 'Variables',
                variablesearchtree: 'Search ctg, wc, steps',
                variablesearchgrid: 'Search variables'
            }
            // end of string declarations //////////////////////////////////
        },
        // shortcuts
        us: 'us_US'
    },

    getStrings: function (lang) {
        if (!lang || _.isUndefined(this.strings[lang]))
            lang = this.getDefaultLang();
        if (_.isString(this.strings[lang])) // got an aliase
            lang = this.strings[lang];
        return !_.isUndefined(this.strings[lang])
            ? this.strings[lang]
            : {};
    },
    // Do the translation
    t: function (label, lang) {
        let path = label.toLowerCase().split('.'),
            p = this.getStrings(lang); // strings
        for (let i = 0; i < path.length; i++) {
            if (!_.isUndefined(p[path[i]])) {
                p = p[path[i]];
            } else {
                let v = label.split('.')[1];
                if (label.split('.')[0] !== 'general') {
                    let val = this.t('general.' + v);
                    return val || v; // not found return default
                } else {
                    return v;
                }
            }
        }
        return p;
    },

    constructor: function (config) {
        this.initConfig(config);
        if (!this.getCurrentLang())
            this.setCurrentLang(this.getDefaultLang());
    }
}


i8n = function (label, lang) {
    return Lang.t(label, lang);
}