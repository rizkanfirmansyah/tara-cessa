import { SweetAlert2Props } from "react-sweetalert2";
import Swal, { SweetAlertIcon } from "sweetalert2";

interface AlertType {
  title?: string;
  desc?: string;
  icon?: SweetAlertIcon;
  duration?: number;
  position?: string;
  type?: string;
}

export const Alert = async ({ desc, icon, title, duration, position, type }: AlertType) => {
  if (type == "toast") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: duration ?? 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: icon ?? "success",
      title: title ?? "Signed in successfully",
    });
  } else {
    Swal.fire({
      title: title ?? "",
      text: desc ?? "",
      icon: icon ?? "info",
    });
  }
};
