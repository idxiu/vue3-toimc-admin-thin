import * as XLSX from 'xlsx'
class UseExcelTemp {
  private static readWorkbookFromLocalFile(file: { raw: Blob }, callback: { (workbook: { SheetNames: any; Sheets: { [x: string]: any } }): void; (arg0: XLSX.WorkBook): void }) {
    const reader = new FileReader()
    reader.onload = function(e: ProgressEvent<FileReader>) {
      const data = (e.target as FileReader).result
      const workbook = XLSX.read(data, {type: 'binary'})
      if(callback) callback(workbook)
    }
    reader.readAsBinaryString(file.raw)
  }
  private static changeExcelTable (sheetArr: any[]) {
    return sheetArr.map((item: { [x: string]: any }) => {
      const key = Object.keys(item)[0]
      return {
        [key]: UseExcelTemp.changeExcelData(item[key] || [])
      }
    })
  }
  private static changeExcelData (excelData: any[]) {
    const set = new Set()
    const lengthData = excelData.map((item: {}) => {
      const key = Object.keys(item)[0]
      const index = key.replace(/[0-9]/, '#').indexOf('#')
      return key.substr(index, key.length - 1)
    })
    const lengthArr: number[] = []
    lengthData.forEach((item: unknown) => {
      if (set.has(item)) {
        const count = JSON.parse(JSON.stringify(lengthArr)).pop() + 1
        lengthArr[lengthArr.length - 1] = count
      } else {
        set.add(item)
        lengthArr.push(1)
      }
    })
    const data = this.sliceArr(excelData, lengthArr)
    return data
  }
  private static sliceArr (arr: any[], length: number[]) {
    const res: object[] = [];
    let element = {}
    let size = 0
    let index = 0
    arr.forEach((ele: { [x: string]: any }) => {
      const key = Object.keys(ele)[0]
      const numberIndex = key.replace(/[0-9]/, '#').indexOf('#')
      const realKey = key.substr(0, numberIndex)
      size > length[index] - 1 && res.push(element)
      if (size === length[index]) {
        size = 1
        index += 1
        element = {
          [realKey]: ele[key]
        }
      } else {
        size += 1
        element = Object.assign({}, element, {
          [realKey]: ele[key]
        })
      }
      key === Object.keys(arr[arr.length -1])[0] && res.push(element)
    })
    return res
  }
  public static getExcelData (file: any): Promise<object[]> {
    return new Promise(resolve => {
      this.readWorkbookFromLocalFile(file, function (workbook: { SheetNames: any; Sheets: { [x: string]: any } }) {
        const sheetNames = workbook.SheetNames // 工作表名称集合
        const res = sheetNames.map((excelName: string | number) => {
          const worksheet = workbook.Sheets[excelName] // 只能通过工作表名称来获取指定工作表
          const excelData: object[] = []
          for(const key in worksheet) {
            key[0] === '!' || excelData.push({
              [key]: worksheet[key].v
            })
          }
          return {
            [excelName]: excelData
          }
        })
        resolve(UseExcelTemp.changeExcelTable(res))
      })
    })
  }
   // 将workbook装化成blob对象
  private static workbook2blob(workbook) {
    // 生成excel的配置项
    const wopts = {
        // 要生成的文件类型
        bookType: 'xlsx',
        // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        bookSST: false,
        type: 'binary'
    };
    const wbout = XLSX.write(workbook, wopts as XLSX.WritingOptions);
    // 将字符串转ArrayBuffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    }
    const blob = new Blob([s2ab(wbout)], {
        type: 'application/octet-stream'
    });
    return blob;
  }
  public static dataToExcel (data: any[], header: string[], fileName: string) {
    if (!data) return
    const worksheetArr: XLSX.WorkSheet[] = []
    data.forEach((item: { [x: string]: unknown[] }) => {
      const key = Object.keys(item)[0]
      const worksheet = XLSX.utils.json_to_sheet(item[key], {
        header, skipHeader:true
      })
      worksheetArr.push(worksheet)
    })
    const workbook = XLSX.utils.book_new()
    data.forEach((item: { [x: string]: unknown[] }, index: number) => {
      const key = Object.keys(item)[0]
      XLSX.utils.book_append_sheet(workbook, worksheetArr[index], key)
    })
    // generate Blob
    // const blob = UseExcelTemp.workbook2blob(workbook)
    const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    const blob = new Blob([wbout], {type: 'application/octet-stream'});
    // save file
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click();
    setTimeout(function() {
        // 延时释放掉obj
        URL.revokeObjectURL(link.href)
        link.remove()
    }, 500)
  }
}

export default UseExcelTemp
