/**
 * Created by aman oumaima on 10/12/2017.
 */


var CronJob = require('cron').CronJob;
var bluetooth = require('./bluetooth_ibeacon');
var job = null;
module.exports = {

    start : function (robot) {
        bluetooth.start(robot)
    },
    stop:function () {
        if (job !== null) {
            job.stop()
            bluetooth.stop()
        }
    }

}
