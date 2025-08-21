// skillswap custom functions

// file extension validation for image uploads
function validateImageExtension(fileInput) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileName = fileInput.value;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileName && !allowedExtensions.includes(fileExtension)) {
        showError(fileInput, `Invalid file type. Only ${allowedExtensions.join(', ')} files are allowed.`);
        fileInput.value = '';
        return false;
    } else {
        clearError(fileInput);
        return true;
    }
}

// show error message
function showError(input, message) {
    clearError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add('is-invalid');
}

// clear error message
function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
}

// form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required.');
            isValid = false;
        } else {
            field.classList.add('is-valid');
            clearError(field);
        }
    });

    // special validation for file input
    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput && fileInput.hasAttribute('required')) {
        if (!fileInput.value) {
            showError(fileInput, 'Please select an image file.');
            isValid = false;
        } else {
            const validExtension = validateImageExtension(fileInput);
            if (!validExtension) {
                isValid = false;
            }
        }
    }

    return isValid;
}

// gallery modal functionality
function initGalleryModals() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            const modalId = 'imageModal' + index;

            // create modal if it doesn't exist
            if (!document.getElementById(modalId)) {
                const modal = createImageModal(modalId, img.src, img.alt);
                document.body.appendChild(modal);
            }

            // show modal
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            modal.show();
        });
    });
}

// create image modal
function createImageModal(modalId, imageSrc, imageAlt) {
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">${imageAlt}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img src="${imageSrc}" alt="${imageAlt}" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    return modalElement.firstElementChild;
}

// initialize when dom is loaded
document.addEventListener('DOMContentLoaded', function () {
    // initialize gallery modals if on gallery page
    if (document.querySelector('.gallery-item')) {
        initGalleryModals();
    }

    // form validation for add skill page
    const addSkillForm = document.querySelector('#addSkillForm');
    if (addSkillForm) {
        // file input validation
        const fileInput = addSkillForm.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', function () {
                validateImageExtension(this);
            });
        }

        // form submission
        addSkillForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateForm(this)) {
                alert('Skill would be added successfully! (This is a demo - no data is actually submitted)');
                this.reset();
                // clear all validation classes and messages
                this.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                });
                this.querySelectorAll('.error-message').forEach(el => el.remove());
            }
        });

        // real time validation
        const inputs = addSkillForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    showError(this, 'This field is required.');
                } else {
                    clearError(this);
                    if (this.value.trim()) {
                        this.classList.add('is-valid');
                    }
                }
            });
        });
    }
});

// smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});