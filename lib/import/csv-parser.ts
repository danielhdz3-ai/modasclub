import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { ColumnMapping } from "@/types/api";

export interface ParsedRow {
  [key: string]: string;
}

/**
 * Parse a CSV file into an array of row objects
 */
export async function parseCSV(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (result) => resolve(result.data),
      error: (error) => reject(new Error(error.message)),
    });
  });
}

/**
 * Parse an Excel file into an array of row objects
 */
export async function parseExcel(file: File): Promise<ParsedRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("El archivo Excel está vacío");
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<ParsedRow>(worksheet, {
    defval: "",
    raw: false,
  });
  return rows;
}

/**
 * Auto-detect file type and parse
 */
export async function parseFile(file: File): Promise<ParsedRow[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) return parseCSV(file);
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return parseExcel(file);
  throw new Error("Formato no soportado. Usa CSV o Excel (.xlsx/.xls)");
}

/**
 * Apply column mapping to transform raw rows into normalized product data
 */
export function applyMapping(
  rows: ParsedRow[],
  mapping: ColumnMapping
): Record<string, string>[] {
  return rows.map((row) => {
    const mapped: Record<string, string> = {};
    for (const [field, csvColumn] of Object.entries(mapping)) {
      if (csvColumn && row[csvColumn] !== undefined) {
        mapped[field] = String(row[csvColumn]).trim();
      }
    }
    return mapped;
  });
}

/**
 * Get unique column names from rows (for building the mapping UI)
 */
export function getColumnNames(rows: ParsedRow[]): string[] {
  if (rows.length === 0) return [];
  return Object.keys(rows[0]);
}
