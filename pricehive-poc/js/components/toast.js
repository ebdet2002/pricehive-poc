// Toast notification component for PriceHive
export class Toast {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = [];
        this.defaultDuration = 3000;
    }

    show(message, type = 'info', duration = this.defaultDuration) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        // Add to container and array
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Bind close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        // Animation and auto-remove
        requestAnimationFrame(() => {
            toast.classList.add('show');
            
            // Auto remove after duration
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        });

        // Limit maximum number of toasts
        if (this.toasts.length > 5) {
            this.remove(this.toasts[0]);
        }

        return toast;
    }

    remove(toast) {
        if (!toast || !this.container.contains(toast)) return;

        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === this.container) {
                this.container.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    // Convenience methods
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    // Clear all toasts
    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}