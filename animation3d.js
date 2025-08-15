document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('3d-container');
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('3d-canvas'), alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // === PERUBAHAN DIMULAI DI SINI ===
    // Membuat model karakter Roblox-style (blocky)
    const personGroup = new THREE.Group();

    // Material
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x334155 }); // Warna badan (gelap)
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0x0ea5e9 }); // Warna kepala & lengan (biru)

    // Kepala (BoxGeometry)
    const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), headMaterial);
    head.position.y = 1.5;

    // Badan (BoxGeometry)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.75), bodyMaterial);
    
    // Tangan Kiri (BoxGeometry)
    const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.75), headMaterial);
    armLeft.position.set(-1, 0, 0);
    
    // Tangan Kanan (clone dari tangan kiri)
    const armRight = armLeft.clone();
    armRight.position.x = 1;

    // Kaki Kiri (BoxGeometry)
    const legLeft = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2, 0.75), bodyMaterial);
    legLeft.position.set(-0.4, -2, 0);

    // Kaki Kanan (clone dari kaki kiri)
    const legRight = legLeft.clone();
    legRight.position.x = 0.4;

    personGroup.add(head, torso, armLeft, armRight, legLeft, legRight);
    scene.add(personGroup);

    // Mundurkan kamera agar karakter terlihat penuh
    camera.position.z = 8;
    // === PERUBAHAN SELESAI ===


    // Mouse interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotate = true;

    const startInteraction = () => {
        isDragging = true;
        autoRotate = false;
    };
    const endInteraction = () => {
        isDragging = false;
        // Optional: uncomment below to resume auto-rotation after a delay
        // setTimeout(() => { autoRotate = true; }, 3000);
    };

    container.addEventListener('mousedown', startInteraction);
    container.addEventListener('touchstart', (e) => {
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        startInteraction();
    });

    container.addEventListener('mouseup', endInteraction);
    container.addEventListener('touchend', endInteraction);
    
    container.addEventListener('mouseleave', endInteraction);
    
    const onMouseMove = (clientX, clientY) => {
        const rect = container.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        if (isDragging) {
            const deltaX = mouseX - previousMousePosition.x;
            const deltaY = mouseY - previousMousePosition.y;

            personGroup.rotation.y += deltaX * 0.01;
            personGroup.rotation.x += deltaY * 0.01;
        }
        previousMousePosition = { x: mouseX, y: mouseY };
    };

    container.addEventListener('mousemove', (e) => onMouseMove(e.clientX, e.clientY));
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        onMouseMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (autoRotate && !isDragging) {
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
