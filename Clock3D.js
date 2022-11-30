// Initialize WebGL renderer
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor('Black');  // background color

// Create a new Three.js scene
const scene = new THREE.Scene();

// Add a camera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 500);
camera.position.set(-3, 1, 12);

// Add a mouse controller to move the camera
const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.zoomSpeed = 3.0;


// // Add light sources
const light = new THREE.AmbientLight("white", 1.5); // soft white light
scene.add(light);


// Materials
const mat = new THREE.MeshStandardMaterial({
    color: '#afeeee',
    metalness: 0.5,
    roughness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
});


function drawClock() {

    const outerRadius = 5;  // inner radius of the ring
    const height = 1;
    const innerRadius = 4.5;

    const outerCircle = new THREE.Shape();
    outerCircle.moveTo(outerRadius, 0);
    const innerCircle = new THREE.Shape();
    innerCircle.moveTo(innerRadius, 0);
    const N = 100;

    const deltaPhi = 2 * Math.PI / N;
    for (let k = 1; k <= N; ++k) {
        outerCircle.lineTo(outerRadius * Math.cos(k * deltaPhi),
            outerRadius * Math.sin(k * deltaPhi));
        innerCircle.lineTo(innerRadius * Math.cos(k * deltaPhi),
            innerRadius * Math.sin(k * deltaPhi));
    }
    outerCircle.holes.push(innerCircle);

    const extrudeSettings = {
        bevelEnabled: false,
        depth: height,
    };
    const extrudeGeo = new THREE.ExtrudeGeometry(outerCircle, extrudeSettings);
    const extrudeRing = new THREE.Mesh(extrudeGeo, mat);
    scene.add(extrudeRing);
}
drawClock();

function drawClockFace() {
    const faceGeo = new THREE.CylinderBufferGeometry(4.51, 4.51, 0.7, 100, 1)
    const faceMat = new THREE.MeshStandardMaterial({
        color: "white",
        metalness: 0.2,
        roughness: 0.5,
        flatShading: true,
        side: THREE.DoubleSide
    });

    const cylinder = new THREE.Mesh(faceGeo, faceMat);
    cylinder.rotation.x = Math.PI / 2
    cylinder.position.z = 0.5;
    scene.add(cylinder);

}
drawClockFace();

function drawTicks(height, width, depth, colors) {

    const tickGeo = new THREE.BoxBufferGeometry(width, height, depth);
    const tickMat = new THREE.MeshStandardMaterial({
        color: colors,
        metalness: 0.5,
        roughness: 0.1,
        flatShading: true,
        side: THREE.DoubleSide
    });
    const tick = new THREE.Mesh(tickGeo, tickMat);

    return tick;
}


const capsuleGeo = new THREE.CapsuleGeometry(0.5, 1.9, 50, 50);
const capsuleMat = new THREE.MeshStandardMaterial({
    color: 0x622A0F,
    metalness: 0.5,
    roughness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
});
const blobHand = new THREE.Mesh(capsuleGeo, capsuleMat);


blobHand.rotation.x = Math.PI / 2
blobHand.position.set(0, 0, 0.5);
blobHand.scale.set(0.5, 0.32, 0.5)
scene.add(blobHand);

const bigTick = {
    x: 1,
    y: .15,
    z: 0.8
};

const smallTick = {
    x: .6,
    y: .055,
    z: 0.8
};

const shiftTicks = {
    small: 4.29,
    big: 3.95
};

for (let i = 0; i < 60; i++) {

    if (i % 5 !== 0) {
        let smallTicks = drawTicks(smallTick.x, smallTick.y, smallTick.z, "Black");

        let SmallTicksAngle = i / 60 * Math.PI * 2;
        smallTicks.rotation.z = -SmallTicksAngle;

        smallTicks.position.set(Math.sin(SmallTicksAngle) * shiftTicks.small, Math.cos(SmallTicksAngle) * shiftTicks.small, 0.5);
        scene.add(smallTicks);
    }
}



for (let i = 0; i < 12; i++) {
    let bigTicksColor;

    switch (i) {
        case 0:
            bigTicksColor = mat;
            break;
        default:
            bigTicksColor = "Black";
    }
    let bigTicks = drawTicks(bigTick.x, bigTick.y, bigTick.z, bigTicksColor);
    let BigTicksAngle = i / 12 * Math.PI * 2;
    bigTicks.rotation.z = -BigTicksAngle;
    bigTicks.position.set(Math.sin(BigTicksAngle) * shiftTicks.big, Math.cos(BigTicksAngle) * shiftTicks.big, 0.5);
    scene.add(bigTicks);
}


//Geo for hour and min Ticks 
const hourGeo = new THREE.SphereGeometry(2, 32, 16);
const minGeo = new THREE.SphereGeometry(3.5, 32, 16);


// Materials
const hanMat = new THREE.MeshStandardMaterial({
    color: 0x13004d,
    metalness: 0.5,
    roughness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
});


//clock 1

let secLine = drawTicks(4, .05, .3, "Black");
scene.add(secLine);

const hourHandHamburg = new THREE.Mesh(hourGeo, hanMat);
hourHandHamburg.scale.set(.04, .04, .4, 1);
scene.add(hourHandHamburg);

const minHandHamburg = new THREE.Mesh(minGeo, hanMat);
minHandHamburg.scale.set(.03, .02, .5, 1);
scene.add(minHandHamburg);

//clock 2
let secHandPerth = drawTicks(4, .05, .2, "Black");
scene.add(secHandPerth);

const hourHandPerth = new THREE.Mesh(hourGeo, hanMat);
hourHandPerth.scale.set(.04, .04, .5, 1);
scene.add(hourHandPerth);

const minHandPerth = new THREE.Mesh(minGeo, hanMat);
minHandPerth.scale.set(.03, .02, .5, 1);
scene.add(minHandPerth);





function hamburgClock() {
    let data = new Date();

    let hourAngle = (data.getHours() + data.getMinutes() / 60) / 12 * Math.PI * 2;
    hourHandHamburg.rotation.x = Math.PI / 2;
    hourHandHamburg.rotation.y = -(hourAngle);
    hourHandHamburg.position.set(Math.sin(hourAngle), Math.cos(hourAngle), 0.9);

    let minAngle = data.getMinutes() / 60 * Math.PI * 2;
    minHandHamburg.rotation.x = Math.PI / 2;
    minHandHamburg.rotation.y = -minAngle;
    minHandHamburg.position.set(Math.sin(minAngle) * 1.9, Math.cos(minAngle) * 1.9, 0.9);

    let secAngle = data.getSeconds() / 60 * Math.PI * 2;
    secLine.rotation.z = -secAngle;
    secLine.position.set(Math.sin(secAngle) * 1.85, Math.cos(secAngle) * 1.85, 0.75);


}

const perthTimeZones = +8;

function perthClock() {
    let data = new Date();
    let hourAnglePerth = -(data.getHours() + perthTimeZones + data.getMinutes() / 60) / 12 * Math.PI * 2;
    hourHandPerth.rotation.x = Math.PI / 2;
    hourHandPerth.rotation.y = -(hourAnglePerth);
    hourHandPerth.position.set(Math.sin(hourAnglePerth), Math.cos(hourAnglePerth), 0.1);

    let minAnglePerth = -data.getMinutes() / 60 * Math.PI * 2;
    minHandPerth.rotation.x = Math.PI / 2;
    minHandPerth.rotation.y = -minAnglePerth;
    minHandPerth.position.set(Math.sin(minAnglePerth) * 1.9, Math.cos(minAnglePerth) * 1.9, 0.1);

    let secAnglePerth = -data.getSeconds() / 60 * Math.PI * 2;
    secHandPerth.rotation.z = -secAnglePerth;
    secHandPerth.position.set(Math.sin(secAnglePerth) * 1.85, Math.cos(secAnglePerth) * 1.85, 0.2);

}


// Render the scene
function render() {
    requestAnimationFrame(render);

    hamburgClock();
    perthClock();
    controls.update();

    renderer.render(scene, camera);

}
render();
