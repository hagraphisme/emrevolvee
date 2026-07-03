document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialiser les icônes Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Gestion de la Modale de Partage et du QR Code
    const shareBtn = document.getElementById('share-btn');
    const shareModal = document.getElementById('share-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const shareUrlInput = document.getElementById('share-url');
    const qrImg = document.getElementById('qr-img');
    const qrLoader = document.getElementById('qr-loader');

    // Déterminer l'URL actuelle de partage
    // Si c'est un fichier en local, on utilise une URL de repli pour la démo
    let currentUrl = window.location.href;
    if (currentUrl.startsWith('file:///')) {
        currentUrl = 'https://emrevolve.github.io';
    }
    shareUrlInput.value = currentUrl;

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareModal.classList.add('active');
            
            // Charger le QR code dynamiquement si ce n'est pas déjà fait
            if (!qrImg.src || qrImg.src.includes('window.location.href') || qrImg.style.display === 'none') {
                const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&color=2d2c29&bgcolor=ffffff`;
                qrImg.src = qrCodeApiUrl;
                
                qrImg.onload = () => {
                    qrLoader.style.display = 'none';
                    qrImg.style.display = 'block';
                };
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            shareModal.classList.remove('active');
        });
    }

    // Fermer la modale si on clique à l'extérieur de la carte de la modale
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.remove('active');
            }
        });
    }

    // 3. Copie du Lien et Notification Toast
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const toast = document.getElementById('toast-notif');

    if (copyLinkBtn && toast) {
        copyLinkBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(shareUrlInput.value);
                showToast("Lien copié avec succès !");
                
                // Animation du bouton de copie
                const copyText = copyLinkBtn.querySelector('.copy-text');
                copyText.textContent = "Copié !";
                setTimeout(() => {
                    copyText.textContent = "Copier";
                }, 2000);
            } catch (err) {
                console.error("Échec de la copie : ", err);
                shareUrlInput.select();
                document.execCommand('copy');
                showToast("Lien sélectionné. Copiez-le manuellement.");
            }
        });
    }

    function showToast(message) {
        const toastMsg = toast.querySelector('.toast-message');
        toastMsg.textContent = message;
        
        toast.classList.add('active');
        
        // Cacher le toast après 3 secondes
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    // 4. Parallaxe de fond immersif sur Desktop
    const desktopBg = document.querySelector('.desktop-bg-blur');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (desktopBg && !isMobile) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            // Déplacer doucement l'arrière-plan de bureau pour créer du relief
            const moveX = mouseX * 20;
            const moveY = mouseY * 20;
            
            desktopBg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
        });
    }
});
