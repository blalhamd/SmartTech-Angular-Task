import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // 1. Toast Notification (Auto-close, top-right)
  // Use for: "Request sent successfully", "Login successful"
  toast(title: string, icon: SweetAlertIcon = 'success'): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: icon,
      title: title,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }

  // 2. Success/Error Modal (Center)
  // Use for: Critical errors or major success messages
  success(title: string, text?: string): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#0d6efd' // Bootstrap Primary
    });
  }

  error(title: string, text?: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#dc3545' // Bootstrap Danger
    });
  }

  // 3. Confirmation Dialog (Replacing confirm())
  // Use for: "Are you sure you want to approve?"
  async confirm(title: string, text: string, confirmBtnText: string = 'Yes, do it!'): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      confirmButtonText: confirmBtnText,
      cancelButtonText: 'Cancel'
    });

    return result.isConfirmed;
  }

  // 4. Input Dialog (Replacing prompt())
  // Use for: Rejection Reason
  async prompt(title: string, placeholder: string): Promise<string | null> {
    const result = await Swal.fire({
      title: title,
      input: 'textarea',
      inputLabel: 'Reason',
      inputPlaceholder: placeholder,
      inputAttributes: {
        'aria-label': 'Type your reason here'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      confirmButtonColor: '#dc3545', // Red for rejection usually
      showLoaderOnConfirm: true,
      preConfirm: (text) => {
        if (!text) {
          Swal.showValidationMessage('You need to write a reason!');
        }
        return text;
      }
    });

    return result.isConfirmed ? result.value : null;
  }
}
