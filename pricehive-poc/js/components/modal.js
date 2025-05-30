// Modal component for PriceHive
export class Modal {
    constructor() {
        this.modalContainer = document.getElementById('modal-container');
        this.activeModal = null;
        this.hasUnsavedChanges = false;
    }

    create({ title, content, onSave, onClose, size = 'medium' }) {
        const modalHTML = `
            <div class="modal">
                <div class="modal-content ${size}">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">${content}</div>
                    ${onSave ? '<div class="modal-footer"><button class="btn btn-primary save-btn">Save</button></div>' : ''}
                </div>
            </div>
        `;

        this.modalContainer.innerHTML = modalHTML;
        this.activeModal = this.modalContainer.querySelector('.modal');

        // Bind events
        const closeBtn = this.activeModal.querySelector('.close-btn');
        const saveBtn = this.activeModal.querySelector('.save-btn');

        closeBtn.addEventListener('click', () => this.close(onClose));
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                try {
                    await onSave();
                    this.hasUnsavedChanges = false;
                    this.close();
                } catch (error) {
                    console.error('Save failed:', error);
                }
            });
        }

        // Close on outside click
        this.activeModal.addEventListener('click', (e) => {
            if (e.target === this.activeModal) {
                this.close(onClose);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(onClose);
            }
        });

        this.show();
        return this.activeModal;
    }

    show() {
        this.modalContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        requestAnimationFrame(() => {
            if (this.activeModal) {
                this.activeModal.classList.add('show');
            }
        });
    }

    async close(onClose) {
        if (this.hasUnsavedChanges) {
            const confirm = window.confirm('You have unsaved changes. Are you sure you want to close?');
            if (!confirm) return;
        }

        if (onClose) {
            try {
                await onClose();
            } catch (error) {
                console.error('Close handler failed:', error);
            }
        }
        
        if (this.activeModal) {
            this.activeModal.classList.remove('show');
            setTimeout(() => {
                this.modalContainer.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.modalContainer.innerHTML = '';
                this.activeModal = null;
                this.hasUnsavedChanges = false;
            }, 300);
        }
    }

    setUnsavedChanges(value) {
        this.hasUnsavedChanges = value;
    }
}