import '../../model/scoop/graph';

Meteor.methods({
    chartList: function (filter, options) {

        let gr = Graphs.findOne({_id: 'xsRrusY6tW3t7xXJd'});

        let data = _.map(gr.pts, (g) => {
            return {
                theta: g[3],
                sin: g[5],
                cos: 1,
                tan: 1
            }
        });


        return {
            total: 85000,
            data: data
        };
    }
});

