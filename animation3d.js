document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('3d-container');
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('3d-canvas'), alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Create a simple person model
    const personGroup = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshLambertMaterial({ color: 0x0ea5e9 }));
    head.position.y = 1.5;
    
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.5), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    
    const armLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 1.2), new THREE.MeshLambertMaterial({ color: 0x0ea5e9 }));
    armLeft.position.set(-0.7, 0.2, 0);
    
    const armRight = armLeft.clone();
    armRight.position.x = 0.7;

    const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 1.5), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    legLeft.position.set(-0.3, -1.5, 0);

    const legRight = legLeft.clone();
    legRight.position.x = 0.3;

    personGroup.add(head, torso, armLeft, armRight, legLeft, legRight);
    scene.add(personGroup);

    camera.position.z = 5;

    // Mouse interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
    });
    container.addEventListener('mouseup', (e) => {
        isDragging = false;
    });
    container.addEventListener('mousemove', (e) => {
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        if (isDragging) {
            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    (deltaMove.y * Math.PI / 180),
                    (deltaMove.x * Math.PI / 180),
                    0,
                    'XYZ'
                ));
            personGroup.quaternion.multiplyQuaternions(deltaRotationQuaternion, personGroup.quaternion);
        }

        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
     container.addEventListener('mouseleave', () => {
        isDragging = false;
    });


    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (!isDragging) {
            personGroup.rotation.y += 0.005;
        }
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
