        // Initialize AOS animations
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false
        });

      

        const contactForm = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const messageTextarea = document.getElementById('message');
        const messageCounter = document.getElementById('message-counter');

        // Handle form submission node js
        contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const data = {
            name: document.getElementById('user_name').value,
            email: document.getElementById('user_email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('https://backend-nodejs-form.onrender.com/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            showToast(result.message, response.ok ? 'success' : 'danger');

            if (response.ok) contactForm.reset();
        } catch (err) {
            console.error(err);
            showToast('Server error. Try again later.', 'danger');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
        
        // Helper function to show toast
        function showToast(message, type) {
            const toastEl = document.getElementById('toast');
            const toastBody = toastEl.querySelector('.toast-body');
            
            // Remove existing classes
            toastEl.classList.remove('text-bg-warning', 'text-bg-success', 'text-bg-danger');
            
            // Add new class and message
            toastEl.classList.add(`text-bg-${type}`);
            toastBody.textContent = message;
            
            // Show toast
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }

        // Create more floating icons dynamically
        document.addEventListener('DOMContentLoaded', function() {
            const floatingIcons = document.querySelector('.floating-icons');
            const icons = [
                'fa-code', 'fa-laptop-code', 'fa-bug', 'fa-terminal', 
                'fa-database', 'fa-server', 'fa-mobile-alt', 'fa-cloud',
                'fa-html5', 'fa-css3-alt', 'fa-js', 'fa-react', 'fa-node',
                'fa-git-alt', 'fa-github', 'fa-npm'
            ];
            
            for (let i = 0; i < 20; i++) {
                const icon = document.createElement('div');
                icon.className = 'floating-icon';
                icon.innerHTML = `<i class="fas ${icons[Math.floor(Math.random() * icons.length)]}"></i>`;
                
                // Random position and animation
                icon.style.top = `${Math.random() * 100}%`;
                icon.style.left = `${Math.random() * 100}%`;
                icon.style.animationDuration = `${5 + Math.random() * 15}s`;
                icon.style.animationDelay = `${Math.random() * 5}s`;
                
                floatingIcons.appendChild(icon);
            }

            // Initialize toast
            const toastEl = document.getElementById('toast');
            const toast = new bootstrap.Toast(toastEl, {
                autohide: true,
                delay: 5000
            });

            // Message character counter
            const messageTextarea = document.getElementById('message');
            const messageCounter = document.getElementById('message-counter');
            
            messageTextarea.addEventListener('input', function() {
                const currentLength = this.value.length;
                const maxLength = this.getAttribute('maxlength');
                messageCounter.textContent = `${currentLength}/${maxLength} characters`;
                
                // Change color based on length - showing warning earlier (at 75% of limit)
                if (currentLength > maxLength * 0.9) {
                    messageCounter.className = 'message-counter error';
                } else if (currentLength > maxLength * 0.75) {
                    messageCounter.className = 'message-counter warning';
                } else {
                    messageCounter.className = 'message-counter';
                }
            });
        });