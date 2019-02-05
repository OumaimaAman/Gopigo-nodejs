/**
 * Created by aman oumaima on 10/12/2017.
 */

// importation des modules node-gopigo et express
var Gopigo   = require('node-gopigo').Gopigo
var Commands = Gopigo.commands
var Robot = Gopigo.robot
var robot
var express = require('express');
var app = express.Router();
var socket_robot = require('./../jobs/').bluetooth

//le numéro du Pin connecté avec le capteur ultrason
var ultrasonicPin = 15

var autonomie = false
var robot_job = require('./../jobs').autonome

console.log(' Projet Réalisé par Oumaima AMAN')


/*initialisation de l'objet de connexion avec le robot Gopigo:

 Paramètres :
 minVoltage : déterminer le voltage minimum pour alimenter le robot .
 criticaloltage : définir un seuil minimal de voltage pour alerter l'utilisateur .
 debug : activer le debogage
 ultrasonicSensorPin : numéro de pin du capteur ultrason
 */
var robot = new Robot({
    minVoltage: 5.5,
    criticalVoltage: 1.2,
    debug: true,
    ultrasonicSensorPin: ultrasonicPin,
    //IRReceiverSensorPin: irreceiverPin
})


//réccuperer l'evenement d'initialisation du robot
robot.on('init', function onInit(res) {
    if (res) {
        console.log('GoPiGo Ready!')
//une fois le robot est initialiser , on peut lancer notre serveur sur le port configuré par avant ( si étape de l'initialisation du rébot s'est mal passée , le serveur ne sera pas accessible.
            robot.board.wait(1000)
        socket_robot.start()
    } else {
        console.log("le robot s'est mal initialisé")
socket_robot.start()

    }
})


/*

 Robot.on represente les differentes evenements geres par le robot , a la base nodejs est un environement oriente event se qui  de partager des evenements dans diffents contexts
 */
robot.on('error', function onError(err) {
    console.log('Something went wrong')
    console.log(err)
})
robot.on('free', function onFree() {
    console.log('GoPiGo is free to go')
})
robot.on('halt', function onHalt() {
    console.log('GoPiGo is halted')
})
robot.on('close', function onClose() {
    console.log('GoPiGo is going to sleep')
})
robot.on('reset', function onReset() {
    console.log('GoPiGo is resetting')
})
robot.on('normalVoltage', function onNormalVoltage(voltage) {
    console.log('Voltage is ok ['+voltage+']')
})
robot.on('lowVoltage', function onLowVoltage(voltage) {
    console.log('(!!) Voltage is low ['+voltage+']')
})
robot.on('criticalVoltage', function onCriticalVoltage(voltage) {
    console.log('(!!!) Voltage is critical ['+voltage+']')
})
robot.init()

// function askForCommand() {
//   rl.question('What do you want me to do? > ', function(answer) {
//     handleAnswer(answer)
//   })
// }


/*
 cette fonction regroupes les actions fournis par le module node-gopigo
 */
function handleAnswer(answer) {
    var message = ''
    switch (answer) {
        case 'help':
            console.log('')
            console.log('reset => performs a reset of LEDs and servo motor')
            console.log('left led on => turn left led on')
            console.log('left led off => turn left led off')
            console.log('right led on => turn right led on')
            console.log('right led off => turn right led off')
            console.log('move forward => moves the GoPiGo forward')
            console.log('move backward => moves the GoPiGo backward')
            console.log('turn left => turns the GoPiGo to the left')
            console.log('turn right => turns the GoPiGo to the right')
            console.log('stop => stops the GoPiGo')
            console.log('increase speed => increases the motors speed')
            console.log('decrease speed => decreases the motors speed')
            console.log('voltage => returns the voltage value')
            console.log('servo test => performs a servo test')
            console.log('ultrasonic distance => returns the distance from an object')
            console.log('move forward with PID => moves the GoPiGo forward with PID')
            console.log('move backward with PID => moves the GoPiGo backward with PID')
            console.log('rotate left => rotates the GoPiGo to the left')
            console.log('rotate right => rotates the GoPiGo to the right')
            console.log('set encoder targeting => sets the encoder targeting')
            console.log('firmware version => returns the firmware version')
            console.log('board revision => returns the board revision')
            console.log('ir receive => returns the data from the IR receiver')
            console.log('exit => exits from this test')
            console.log('')
            break
        case 'reset':
            robot.reset()
            break
        case 'left led on':
            var res = robot.ledLeft.on()
            console.log('Left led on::'+res)
            break
        case 'left led off':
            var res = robot.ledLeft.off()
            console.log('Left led off::'+res)
            break
        case 'right led on':
            var res = robot.ledRight.on()
            console.log('Right led on::'+res)
            break
        case 'right led off':
            var res = robot.ledRight.off()
            console.log('Right led off::'+res)
            break
        case 'move forward':
        case 'w':
            var res = robot.motion.forward(false)
            console.log('Moving forward::' + res)
            break
        case 'turn left':
        case 'a':
            var res = robot.motion.left()
            console.log('Turning left::' + res)
            break
        case 'turn right':
        case 'd':
            var res = robot.motion.right()
            console.log('Turning right::' + res)
            break
        case 'move backward':
        case 's':
            var res = robot.motion.backward(false)
            console.log('Moving backward::' + res)
            break
        case 'stop':
        case 'x':
            var res = robot.motion.stop()
            console.log('Stop::' + res)
            socket_robot.stop()
            break
        case 'increase speed':
        case 't':
            var res = robot.motion.increaseSpeed()
            console.log('Increasing speed::' + res)
            break
        case 'decrease speed':
        case 'g':
            var res = robot.motion.decreaseSpeed()
            console.log('Decreasing speed::' + res)
            break
        case 'voltage':
        case 'v':
            var res = robot.board.getVoltage()
            console.log('Voltage::' + res + ' V')
            break
        case 'servo test':
        case 'b':
            robot.servo.move(0)
            console.log('Servo in position 0')

            robot.board.wait(1000)
            robot.servo.move(180)
            console.log('Servo in position 180')

            robot.board.wait(1000)
            robot.servo.move(90)
            console.log('Servo in position 90')
            break
        case 'exit':
        case 'z':
            robot.close()
            process.exit()
            break
        case 'ultrasonic distance':
        case 'u':
            var res = robot.ultraSonicSensor.getDistance()
            console.log('Ultrasonic Distance::' + res + ' cm')
            break
        case 'ir receive':
            var res = robot.IRReceiverSensor.read()
            console.log('IR Receiver data::')
            console.log(res)
            break
        case 'l':
            // TODO
            break
        case 'move forward with pid':
        case 'i':
            var res = robot.motion.forward(true)
            console.log('Moving forward::' + res)
            break
        case 'move backward with pid':
        case 'k':
            var res = robot.motion.backward(true)
            console.log('Moving backward::' + res)
            break
        case 'rotate left':
        case 'n':
            var res = robot.motion.leftWithRotation()
            console.log('Rotating left::' + res)
            break
        case 'rotate right':
        case 'm':
            var res = robot.motion.rightWithRotation()
            console.log('Rotating right::' + res)
            break
        case 'set encoder targeting':
        case 'y':
            var res = robot.encoders.targeting(1, 1, 18)
            console.log('Setting encoder targeting:1:1:18::' + res)
            break
        case 'firmware version':
        case 'f':
            var res = robot.board.version()
            console.log('Firmware version::' + res)
            break
        case 'board revision':
            var res = robot.board.revision()
            console.log('Board revision::' + res)
            break
    }
    return res

}

/**
 /distance : renvoi la distance entre le robot et le obstacle rencontré, cette distance est  mesuré par capture ultrasons.
 /action : deplace le robot en presisnat l'action souhaité dans le paramétre de la méthode handleAnswer qu'on a defini
 */
app.get('/distance',function(request,response){

    var res = robot.ultraSonicSensor.getDistance()
    console.log('Ultrasonic Distance::' + res + ' cm')
    response.status(200).json({
        "response":res
    })
})

app.get('/action',function(request,response){

// let action = request.query.action;
    var action = request.query.action;
    if(action){
// let res = handleAnswer(action);
        var res = handleAnswer(action);
        console.log(res)
    }
    response.status(200).json({
        "response":"true"
    })
})

app.get('/autonome',function(request,response){
    autonomie = true
    socket_robot.stop()
    socket_robot.start(robot)
    //console.log('icii')
    response.status(200).json({response:'ok'})
})

app.get('/beacon',function(request,response){
    socket_robot.start()
    //console.log('icii')
    response.status(200).json({response:'ok'})
})

module.exports = app
