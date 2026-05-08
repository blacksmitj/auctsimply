/**
 * Menghasilkan file gambar yang di-crop 1:1 dan dikompresi agar di bawah 1MB
 */
export async function processImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Tentukan ukuran target (misal 1000x1000 px)
        const targetSize = 1000;
        canvas.width = targetSize;
        canvas.height = targetSize;

        // Hitung cropping 1:1 (tengah)
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (img.width > img.height) {
          sourceX = (img.width - img.height) / 2;
          sourceWidth = img.height;
        } else {
          sourceY = (img.height - img.width) / 2;
          sourceHeight = img.width;
        }

        // Gambar ke canvas
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          targetSize,
          targetSize
        );

        // Kompresi ke Blob (JPEG)
        const compress = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Gagal melakukan konversi gambar"));
                return;
              }

              // Jika masih di atas 1MB dan kualitas masih bisa diturunkan
              if (blob.size > 1024 * 1024 && quality > 0.5) {
                compress(quality - 0.1);
              } else {
                resolve(blob);
              }
            },
            "image/jpeg",
            quality
          );
        };

        compress(0.8);
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
  });
}
