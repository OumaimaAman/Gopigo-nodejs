# Gopigo-nodejs
## Contexte : 
la triangulation est une technique permettant de déterminer la position d'un point en mesurant
les angles entre ce point et d'autres points de référence dont la position est connue, et ceci plutôt que
de mesurer directement la distance entre les points. Ce point peut être considéré comme étant le
troisième sommet d'un triangle dont on connaît deux angles et la longueur d'un côté.
Ce projet consiste à réaliser une application mobile qui permet de piloter et localiser notre
robot Gopigo en se basant sur le principe de triangulation.

## L’environnement Nodejs :
Le robot Gopigo propose plusieurs langages de programmation (Python, Scratch, Java, Node Js,
C./C++). Nous avons opté de programmer en Nodejs puisqu'il est Open Source, il a une
communauté très active, il utilise le moteur d'exécution ultrarapide V8 (les programmes Nodejs
sont développés en Javascript) .

Node.js est très riche grâce à son extensibilité. Ces extensions de Node.js sont appelées modules.
Ces modules sont accessibles depuis un repot partagé appelé npm (node packege manadger)

## Les Sockets.io :
Socket.io est un module de Node.js qui permet de créer des Web Sockets, c'est-à-dire des
connections bidirectionnelles entre clients et serveur qui permettent une communication en
temps réel sur un autre protocole que le protocole http normalement utilisé dans les pages web.
Ce type de technique est utilisé pour créer des applications telles que des systèmes de
communication en temps réel (i.e. des Chats), des jeux multi-utilisateur, des applications de
collaboration, etc.
Bien que Socket.io soit un module qui peut être utilisé individuellement, la plupart des exemples
contenus dans la page utilise également le module Express.js.

## Calcul des distances :
Le calcul de distance entre le robot Gopigo et les IBeacon se base la technique Bluetooth, en
utilisant la valeur RSSI.
Le RSSI est une mesure de la puissance en réception d'un signal reçu d'un périphérique
Bluetooth .La bonne chose à propos de RSSI est que nous pouvons traduire les mesures en
estimations de distance en mètres ou en centimètres. Nous pouvons décrire la relation entre RSSI
et la distance à l'aide d'un modèle, le modèle Log Shadowing Log / Log Distance Pathloss Model.
• x = (RSSI_value-A0) / (- 10 * n)
• distance = ((10 ^ x) * 100) + c
• A0 = Valeur RSSI moyenne mesurée à une distance de 1 m de l'appareil émetteur.
• n = exposant de la propagation du signal. C'est une constante qui diffère d'environnement à
environnement (0 <n <5).
• c = Constante d'environnement. C'est un poids ajouté à la distance pour réduire l'erreur. C'est
une constante qui diffère d'environnement à environnement.

## L’iBeacon
L’iBeacon est une balise de géolocalisation qui fonctionne sur le même principe qu’une borne
Wifi. La balise possède un identifiant unique et émet un signal de manière continu pouvant aller
jusqu'à 180 mètres en fonction de la balise installée (comptez en moyenne 50 mètres).
Un identifiant se découpe en trois parties :
• Une partie fixe qui correspond à l’identifiant de l’application ou de la marque
• Un identifiant dit « Major » qui par exemple correspond à un magasin
• Un identifiant dit « Minor » qui par exemple correspond à un rayon
