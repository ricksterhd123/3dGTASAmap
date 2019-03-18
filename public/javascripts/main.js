var lastTick = 0;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// add to DOM
var div = document.getElementById("app");
div.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera);
// scene.add(controls.getObject())
// WIDTH & HEIGHT of the plane
const WIDTH = 500;
const HEIGHT = 500;

// Plane geometry
var planeGeometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 1, 1)
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
camera.position.z = 200;
camera.position.y = -400
camera.rotation.x = 45 * Math.PI / 180
plane.rotation.x = 180 * Math.PI / 180

// Line for each player
var lines = [];

// Material for each line
var material = new THREE.LineBasicMaterial( {
	color: 0xff0000,
	linewidth: 1000,
} );

// Utility function to convert MTA:SA coordinates to the threeJS plane.
function worldCoordsToPlane(position){
	const mX = 3000;
	const mY = 3000;
    let radians = (Math.PI * 2) - plane.rotation.z;
    let x = (position[0] / mX) * (WIDTH*0.5)
    let y = (position[1] / mY) * (HEIGHT*0.5)
	// Rotate the opposite direction.
    let nx = x * Math.cos(radians) - y * Math.sin(radians);
    let ny = x * Math.sin(radians) + y * Math.cos(radians);
    return {x: nx, y: ny, z: position[2]};
}

// Draw players
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
        pGeo.vertices.push(new THREE.Vector3(position.x, position.y, 100));
        let line = new THREE.Line(pGeo, material);
        lines.push(line);
        scene.add(line);
    }
}

// Animate
var animate = function() {
	requestAnimationFrame(animate);
    plane.rotation.z += 0.001;
    if (plane.rotation.z >= Math.PI * 2){
        plane.rotation.z = 0;
    }
	drawPlayers(playerInfo);
    renderer.render(scene, camera)
};
animate();


raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();


function onWindowResize() {
    camera.left = window.innerWidth / - 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / - 2;
    camera.aspect = window.innerWidth / window.innerHeight;

    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseWheel( event ) {

    var fovMAX = 160;
    var fovMIN = 1;

    camera.fov -= event.wheelDeltaY * 0.05;
    camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
	camera.updateProjectionMatrix ()
}
document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
