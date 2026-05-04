"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Check, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/store/uiStore";
import type { ColumnMapping, ImportResult } from "@/types/api";

interface CsvImporterProps {
  supplierId: string;
  onComplete?: (result: ImportResult) => void;
}

type Step = "upload" | "preview" | "mapping" | "importing" | "done";

const REQUIRED_FIELDS: { key: keyof ColumnMapping; label: string; required?: boolean }[] = [
  { key: "name", label: "Nombre del producto", required: true },
  { key: "supplier_sku", label: "SKU proveedor" },
  { key: "brand", label: "Marca" },
  { key: "description", label: "Descripción" },
  { key: "cost_price", label: "Precio de coste" },
  { key: "price", label: "Precio de venta" },
  { key: "stock_quantity", label: "Stock" },
  { key: "images", label: "Imágenes (URLs separadas por |)" },
  { key: "gender", label: "Género (men/women/unisex/kids)" },
  { key: "weight", label: "Peso (kg)" },
];

export function CsvImporter({ supplierId, onComplete }: CsvImporterProps) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({});
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useUIStore();

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", f);
    formData.append("supplier_id", supplierId);
    formData.append("preview", "true");

    try {
      const res = await fetch("/api/import/csv", { method: "POST", body: formData });
      const data = await res.json() as { columns: string[]; preview: Record<string, string>[]; total: number };
      setColumns(data.columns ?? []);
      setPreviewRows(data.preview ?? []);
      setTotalRows(data.total ?? 0);
      setStep("preview");
    } catch {
      addToast({ message: "Error al leer el archivo", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [supplierId, addToast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = async () => {
    if (!file) return;
    const nameField = mapping["name"];
    if (!nameField) {
      addToast({ message: "Debes mapear el campo 'Nombre del producto'", type: "error" });
      return;
    }

    setStep("importing");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("supplier_id", supplierId);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      const res = await fetch("/api/import/csv", { method: "POST", body: formData });
      const data = await res.json() as { success: boolean; result: ImportResult; error?: string };
      if (data.success) {
        setResult(data.result);
        setStep("done");
        onComplete?.(data.result);
        addToast({ message: `Importación completada: ${data.result.created} creados, ${data.result.updated} actualizados`, type: "success" });
      } else {
        addToast({ message: data.error ?? "Error en la importación", type: "error" });
        setStep("mapping");
      }
    } catch {
      addToast({ message: "Error de conexión", type: "error" });
      setStep("mapping");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("upload");
    setFile(null);
    setColumns([]);
    setPreviewRows([]);
    setMapping({});
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {(["upload", "preview", "mapping", "done"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all ${
              step === s ? "bg-primary text-white" :
              ["preview", "mapping", "done"].indexOf(step) > ["upload", "preview", "mapping", "done"].indexOf(s)
                ? "bg-success text-white"
                : "bg-surface-2 text-text-muted border border-border"
            }`}>
              {["preview", "mapping", "done"].indexOf(step) > ["upload", "preview", "mapping", "done"].indexOf(s)
                ? <Check size={12} strokeWidth={2.5} />
                : i + 1}
            </div>
            {i < 3 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
        <div className="ml-2 flex gap-4 text-[11px] text-text-muted uppercase tracking-wider">
          <span className={step === "upload" ? "text-primary" : ""}>Subir</span>
          <span className={step === "preview" ? "text-primary" : ""}>Vista previa</span>
          <span className={step === "mapping" ? "text-primary" : ""}>Mapear</span>
          <span className={step === "done" ? "text-primary" : ""}>Listo</span>
        </div>
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <div
          className={`border-2 border-dashed rounded-card p-12 text-center transition-all cursor-pointer ${
            dragOver ? "border-primary bg-primary-pale" : "border-border hover:border-primary-light"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {loading ? (
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
          ) : (
            <Upload size={32} strokeWidth={1} className="text-text-muted mx-auto mb-3" />
          )}
          <p className="text-[14px] text-text-secondary font-light mb-1">
            Arrastra tu archivo CSV o Excel aquí
          </p>
          <p className="text-[12px] text-text-muted">o haz clic para seleccionar · .csv, .xlsx, .xls</p>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} strokeWidth={1.5} className="text-primary" />
              <span className="text-[13px] font-medium">{file?.name}</span>
              <span className="text-[12px] text-text-muted">· {totalRows} filas detectadas</span>
            </div>
          </div>

          {/* Preview table */}
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-surface-2 border-b border-border">
                  {columns.slice(0, 6).map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-medium text-text-secondary uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                  {columns.length > 6 && <th className="px-3 py-2 text-text-muted">+{columns.length - 6} más</th>}
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-2">
                    {columns.slice(0, 6).map((col) => (
                      <td key={col} className="px-3 py-2 text-text font-light truncate max-w-[150px]">
                        {row[col] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setStep("mapping")}>
              Continuar al mapeo
            </Button>
            <Button variant="outline" onClick={reset}>
              Cambiar archivo
            </Button>
          </div>
        </div>
      )}

      {/* Step: Mapping */}
      {step === "mapping" && (
        <div className="space-y-4">
          <p className="text-[13px] text-text-secondary font-light">
            Asocia las columnas de tu archivo con los campos de ModasClub.
            El campo <strong>Nombre del producto</strong> es obligatorio.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {REQUIRED_FIELDS.map((field) => (
              <div key={field.key} className="grid grid-cols-2 gap-4 items-center p-3 rounded-lg bg-surface-2">
                <label className="text-[13px] font-light text-text flex items-center gap-1.5">
                  {field.label}
                  {field.required && <span className="text-error text-[10px]">*</span>}
                </label>
                <select
                  value={mapping[field.key] ?? ""}
                  onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value || undefined })}
                  className="input-base py-2 text-[13px]"
                >
                  <option value="">— No mapear —</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={handleImport} loading={loading}>
              <Sparkles size={14} strokeWidth={1.5} />
              Importar {totalRows} productos
            </Button>
            <Button variant="outline" onClick={() => setStep("preview")}>
              Volver
            </Button>
          </div>
        </div>
      )}

      {/* Step: Importing */}
      {step === "importing" && (
        <div className="text-center py-12">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="font-[family-name:var(--font-cormorant)] italic text-2xl text-text mb-2">
            Importando productos...
          </p>
          <p className="text-[13px] text-text-muted font-light">
            Esto puede tardar unos segundos según la cantidad de productos.
          </p>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && result && (
        <div className="space-y-4">
          <div className="bg-success/10 border border-success/20 rounded-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check size={20} strokeWidth={2} className="text-success" />
              <h3 className="font-medium text-[15px] text-text">¡Importación completada!</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total filas", value: result.total },
                { label: "Creados", value: result.created },
                { label: "Actualizados", value: result.updated },
                { label: "Errores", value: result.errors.length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-[family-name:var(--font-cormorant)] italic text-3xl text-text">{s.value}</p>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-error/5 border border-error/20 rounded-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} strokeWidth={1.5} className="text-error" />
                <span className="text-[13px] font-medium text-error">{result.errors.length} errores</span>
              </div>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-[12px] text-text-secondary font-light">
                    Fila {e.row} · SKU: {e.sku} · {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="primary" onClick={() => window.location.href = "/admin/productos"}>
              Ver productos importados
            </Button>
            <Button variant="outline" onClick={reset}>
              Nueva importación
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
