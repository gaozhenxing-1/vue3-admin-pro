/**
 * Excel 导入导出工具
 * 基于 xlsx + file-saver
 */
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * 导出数据为 Excel 文件
 * @param data  数据数组
 * @param filename  文件名（不含后缀）
 * @param sheetName  Sheet 名称
 */
export function exportExcel<T extends Record<string, any>>(
  data: T[],
  filename = 'export',
  sheetName = 'Sheet1',
) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `${filename}.xlsx`)
}

/**
 * 从 Excel 文件导入数据
 * @returns Promise<T[]> 解析后的 JSON 数组
 */
export function importExcel<T = Record<string, any>>(): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls,.csv'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return reject(new Error('No file selected'))

      try {
        const data = await file.arrayBuffer()
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<T>(ws)
        resolve(json)
      } catch (err) {
        reject(err)
      }
    }

    input.click()
  })
}
