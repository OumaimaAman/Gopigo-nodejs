

var Bleacon = require('bleacon');

var uuid = ['3d4f13b4d1fd404980e5d3edcc840b6a','3d4f13b4d1fd404980e5d3edcc840b60'];

var beacons = [
    {
        name:'beacon : 5373 : 7353',
        major:"21363",
        minor:"29523",
        major_b:"5373",
        minor_b:"7353",
        uuid:'3d4f13b4d1fd404980e5d3edcc840b6a',
        mean_distance:[],
        proximity:""
    },
    {
        name:'beacon : CBA5 : 519D',
        major:"35278",
        minor:"12945",
        major_b:"CBA5",
        minor_b:"519D",
        uuid:'3d4f13b4d1fd404980e5d3edcc840b60',
        mean_distance:[],
        proximity:""
    },
    {
        name:'beacon : 89CE : 3291',
        major:"52133",
        minor:"20893",
        major_b:"89CE",
        minor_b:"3291",
        uuid:'3d4f13b4d1fd404980e5d3edcc840b60',
        mean_distance:[],
        proximity:""
    }
];

var ranging = [
    {
        name:'immediate',
        mean:5
    },
    {
        name:'near',
        mean:10
    },
    {
        name:'far',
        mean:50
    }]

/*
 *******
 bleacon properties:

 uuid
 major
 minor
 measuredPower
 rssi
 accuracy
 proximity : current proximity ('unknown', 'immediate', 'near', or 'far')
 *****/

module.exports = {

    start: function (robot) {
        var socket = require('socket.io-client')('http://192.168.0.16:3000')
        //var distance_job = require('./jobs').distance

        socket.on('connect', function () {
            console.log('connected to server')
            Bleacon.on('discover', function (bleacon) {
                var beacon = beacons.find(function (b) {
                    return bleacon.major + ''.toString('ascii') === b.major
                })
                if (beacon) {
                    //Bleacon.stopScanning()
                    var distance = calculateAccuracy(bleacon.rssi, bleacon.measuredPower);
                    // console.log('proximity : ',bleacon.proximity,'distance : ',distance ,' beacon : ',beacon.name)
                    var rang = ranging.find(function (r) {
                        return bleacon.proximity === r.name && distance < r.mean
                    })
                    if (rang && bleacon.rssi) beacon.mean_distance.push(distance)
                    if (beacon.mean_distance.length === 6) {
                        var avg = (beacon.mean_distance.reduce(function (a, b) {
                            return a + b
                        }) / beacon.mean_distance.length)
                        console.log('mean distance : ', avg, ' beacon : ', beacon.name)
                        socket.emit('distance', {'beacon': beacon, distance: avg})
                        if(robot) autonomie(robot)
                        beacon.mean_distance = []
                    }
                }
                // calculateDistance(bleacon.rssi,bleacon.measuredPower)
                /*setInterval(function () {
                 Bleacon.startScanning(uuid)
                 }, 3000)*/
            });

            Bleacon.startScanning(uuid);
        })
        socket.on('disconnect', function () {
            console.log('disconnected from server');
            Bleacon.stopScanning()
        });

    },
    stop:function () {
        Bleacon.stopScanning()
    }
}




function calculateAccuracy( rssi) {
    if (rssi == 0) {
        return -1.0; // if we cannot determine accuracy, return -1.
    }

    var txPower = -59
    var ratio = rssi*1.0/txPower;
    if (ratio < 1.0) {
        return Math.pow(ratio,10);
    }
    else {
        var accuracy =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;
        return accuracy;
    }
}



function calculateDistance(rssi,txPower) {

    var d = Math.pow(10 , ((txPower - rssi) / 20))
    return  Math.pow(10*d , ((txPower - rssi) / 20))

}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function autonomie(robot) {
    var min_distance = 60
    robot.servo.move(90)
    robot.board.wait(1000)
    var dis = robot.ultraSonicSensor.getDistance()
    if (dis > min_distance) {
        //console.log('Forword ')
        robot.motion.forward(false)
        //console.log('Moving forward::')
        robot.board.wait(1000)
    } else {
        //console.log('obstacle')
        robot.motion.stop()
        robot.servo.move(28)
        robot.board.wait(1000)
        var lest_dist = robot.ultraSonicSensor.getDistance()
        robot.board.wait(1000)
        robot.servo.move(112)
        var right_dist = robot.ultraSonicSensor.getDistance()
        if (lest_dist > right_dist && lest_dist > min_distance) {
            //console.log('choose left')
            robot.motion.left()
            robot.board.wait(1000)
        } else {
            if (lest_dist < right_dist && right_dist > min_distance) {
                console.log('choose right')
                robot.motion.right()
            } else {
                //      console.log('choose backward')
                robot.motion.backward(false)
                robot.board.wait(2000)
//          let index = Math.floor(Math.random()*2)
                var index = Math.floor(Math.random() * 2)
                index == 1 ? robot.motion.rightWithRotation() : robot.motion.leftWithRotation()
            }

        }
    }
}
