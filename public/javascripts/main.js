var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var div = document.getElementById("app");
div.appendChild(renderer.domElement);

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
camera.position.z = 500;
camera.position.y = -500
camera.rotation.x = 45 * Math.PI / 180
plane.rotation.x = 180 * Math.PI / 180
var animate = function() {
    requestAnimationFrame(animate);
    plane.rotation.z += 0.001;
    renderer.render(scene, camera)
};

animate();
