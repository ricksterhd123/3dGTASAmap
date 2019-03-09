var lastTick = 0;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var div = document.getElementById("app");
div.appendChild(renderer.domElement);
const WIDTH = 500;
const HEIGHT = 500;

// Plane geometry
var planeGeometry = new THREE.PlaneGeometry(500, 500, 1, 1)
var ground_texture = THREE.ImageUtils.loadTexture('images/gtasa.png', {}, function() {
    renderer.render(scene,camera);
});

// Plane material
var ground_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({map : ground_texture, side: THREE.DoubleSide}),
    .9, // high friction
    .9 // low friction
);

// Point light
var light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 250);
scene.add(light);

// Plane mesh
var plane = new THREE.Mesh(planeGeometry, ground_material);
scene.add(plane);

// Positioning & animation
camera.position.z = 150;
camera.position.y = -300
camera.rotation.x = 45 * Math.PI / 180
plane.rotation.x = 180 * Math.PI / 180

var lines = [];
var material = new THREE.LineBasicMaterial( {
	color: 0xff0000,
	linewidth: 1000,
} );

let mX = 3000
let mY = 3000

function worldCoordsToPlane(position){
    let radians = (Math.PI * 2) - plane.rotation.z;
    //console.log("Radians: " + radians);
    let x = (position[0] / mX) * (WIDTH*0.5)
    let y = (position[1] / mY) * (HEIGHT*0.5)
    let nx = x * Math.cos(radians) - y * Math.sin(radians);
    let ny = x * Math.sin(radians) + y * Math.cos(radians);
    //console.log(`(${x}, ${y})`);
    return {x: nx, y: ny, z: position[2]};
}

function drawPlayers(players){
    if (!players) return;
    for (var i = 0; i <= lines.length -1; i++){
        scene.remove(lines[i]);
    }

    lines = [];
    for (var i= 0; i <= players.length - 1; i++){
        let pGeo = new THREE.Geometry();
        let position = worldCoordsToPlane(players[i].position);
        pGeo.vertices.push(new THREE.Vector3(position.x, position.y, 0));
        pGeo.vertices.push(new THREE.Vector3(position.x, position.y, position.z));
        console.log("z: "+ position.z);
        let line = new THREE.Line(pGeo, material);

        lines.push(line);
        scene.add(line);
    }
}

var animate = function() {
    let date = new Date();
    let tick = date.getTime();

    drawPlayers(playerInfo);
    requestAnimationFrame(animate);
    plane.rotation.z += 0.001;
    if (plane.rotation.z >= Math.PI * 2){
        plane.rotation.z = 0;
    }
    renderer.render(scene, camera)
};
animate();
