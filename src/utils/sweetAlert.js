import Swal from 'sweetalert2';

// Success Alert
export const showSuccess = (title = 'Success!', text = '') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonColor: '#667eea',
    confirmButtonText: 'OK'
  });
};

// Error Alert
export const showError = (title = 'Error!', text = '') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK'
  });
};

// Warning Alert
export const showWarning = (title = 'Warning!', text = '') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'OK'
  });
};

// Info Alert
export const showInfo = (title = 'Info', text = '') => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: text,
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'OK'
  });
};

// Confirmation Dialog
export const showConfirm = (title = 'Are you sure?', text = '', confirmText = 'Yes', cancelText = 'Cancel') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#667eea',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true
  });
};

// Delete Confirmation
export const showDeleteConfirm = (itemName = 'this item') => {
  return Swal.fire({
    title: 'Delete Confirmation',
    text: `Are you sure you want to delete ${itemName}? This action cannot be undone!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });
};

// Loading/Processing
export const showLoading = (title = 'Processing...', text = 'Please wait') => {
  return Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close any open alert
export const closeAlert = () => {
  Swal.close();
};

// Toast notification (small popup)
export const showToast = (message, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  return Toast.fire({
    icon: icon,
    title: message
  });
};
