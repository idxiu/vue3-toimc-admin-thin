/**
 * @description: base64 to blob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',')
  const typeItem = arr[0]
  const mime = typeItem.match(/:(.*?);/)![1]
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * img url转base64
 * @param url
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>
    const ctx = canvas!.getContext('2d')

    const img = new Image()
    img.crossOrigin = ''
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject()
      }
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL(mineType || 'image/png')
      canvas = null
      resolve(dataURL)
    }
    img.src = url
  })
}

// img url转blob
export function imageToBlob(imageURL) {
  const canvas = document.createElement('canvas') as Nullable<HTMLCanvasElement>
  const ctx = canvas!.getContext('2d')
  const img = new Image()
  // img.crossOrigin = ''
  img.crossOrigin = 'anonymous'
  img.src = imageURL
  return new Promise((resolve, reject) => {
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject()
      }
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          // here the image is a blob
          resolve(blob)
        },
        'image/png',
        1
      )
    }
  })
}

export async function copyImage(imageURL) {
  const blob = await imageToBlob(imageURL)
  return new Promise((resolve, reject) => {
    if (blob) {
      const item = new ClipboardItem({ 'image/png': blob as Blob })
      navigator.clipboard.write([item])
      resolve('复制成功')
    }
    reject('复制失败')
  })
}
