import { useQRCode } from "next-qrcode";

export default function QR({
  text = "https://github.com/bunlong/next-qrcode",
  type = "image/jpeg",
  quality = 0.3,
  errorCorrectionLevel = "M",
  margin = 3,
  scale = 4,
  width = 200,
  color = {
    dark: "#111111",
    light: "#ffffff",
  },

}) {
  const { Image: QRCodeImage } = useQRCode(); // Renamed the component to avoid conflicts

  return (
    <QRCodeImage
      text={text || ""}
      options={{
        type: type || "image/jpeg",
        quality: quality ?? 0.3,
        errorCorrectionLevel: errorCorrectionLevel || "M",
        margin: margin ?? 3,
        scale: scale ?? 4,
        width: width ?? 200,
        color: {
          dark: color?.dark || "#010599FF",
          light: color?.light || "#FFBF60FF",
        },
      }}
    />
  );
}
