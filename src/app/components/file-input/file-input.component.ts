import { CommonModule } from '@angular/common';
import {
    Component, Input, OnInit, OnChanges, SimpleChanges, forwardRef, OnDestroy, Output, EventEmitter
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule, AbstractControl, FormControl
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface FileInputFieldInterface {
    id: string | number;
    label: string;
    formControlName: string;
    control: string;
    accept?: string;
    multiple?: boolean;
    maxSizeMB?: number;
}

@Component({
    selector: 'FileInputField',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './file-input.component.html',
    styleUrl: './file-input.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileInputFieldComponent),
            multi: true
        }
    ]
})
export class FileInputFieldComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    /** UI */
    @Input() label = '';
    @Input() id: string | number = '';
    @Input() name = '';
    @Input() helperText?: string;

    /** Form */
    @Input() control: AbstractControl | null = null;
    @Input() required = false;

    /** Files */
    @Input() accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    @Input() maxSizeMB = 5;
    @Input() multiple = false;

    /** Behavior / extras */
    @Input() inputClass = '';
    @Input() showPreview = true;
    @Input() showDownload = true;
    @Input() showDelete = true;

    /** Output events */
    @Output() fileSelected = new EventEmitter<File | File[]>();
    @Output() fileRemoved = new EventEmitter<File>();
    @Output() fileError = new EventEmitter<string>();

    /** Internal */
    private _disabled = false;
    fileList: File[] = [];
    value: any;
    private destroy$ = new Subject<void>();

    /** Drag & drop state + object URLs */
    dragActive = false;
    private objectUrls = new Map<File, string>();

    /** ---- Getters ---- */
    get disabled(): boolean {
        if (this.formControl) return this.formControl.disabled;
        return this._disabled;
    }
    @Input()
    set disabled(val: boolean) {
        this._disabled = val;
        if (this.formControl) {
            val ? this.formControl.disable({ emitEvent: false }) : this.formControl.enable({ emitEvent: false });
        }
    }

    get formControl(): FormControl | null {
        return this.control instanceof FormControl ? this.control : null;
    }

    get isRequired(): boolean {
        if (this.required) return true;
        if (this.control && this.control.validator) {
            const errors = this.control.validator({ value: '' } as AbstractControl);
            return !!(errors && (errors as any)['required']);
        }
        return false;
    }

    get hasFile(): boolean {
        return this.fileList.length > 0;
    }

    /** ---- Lifecycle ---- */
    ngOnInit(): void {
        if (!this.id) this.id = `file-input-${Math.random().toString(36).slice(2, 11)}`;
        this.syncWithFormControl();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['control']?.currentValue) this.syncWithFormControl();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.clearAllObjectUrls();
    }

    /** ---- ControlValueAccessor ---- */
    private onChange = (v: any) => (this.value = v);
    private onTouched = () => { };

    writeValue(value: any): void {
        this.value = value;

        // Evita fugas de memoria si cambia el valor desde fuera
        this.clearAllObjectUrls();

        if (Array.isArray(value)) {
            this.fileList = value;
        } else if (value instanceof File) {
            this.fileList = [value];
        } else {
            this.fileList = [];
        }

        if (this.formControl && this.formControl.value !== value) {
            this.formControl.setValue(value, { emitEvent: false });
        }
    }
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void { this._disabled = isDisabled; }

    /** ---- Form sync ---- */
    private syncWithFormControl(): void {
        if (!this.formControl) return;

        if (this.formControl.value !== null && this.formControl.value !== undefined) {
            this.writeValue(this.formControl.value);
        }

        this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (this.value !== value) this.writeValue(value);
        });
    }

    /** ---- UI helpers ---- */
    buildHelperText(): string {
        const types = this.accept ? this.accept.split(',').map(t => t.trim()).join(', ') : 'Cualquier tipo permitido';
        const size = `${this.maxSizeMB}MB máx`;
        return this.multiple
            ? `Puedes seleccionar varios. Tipos: ${types} • Tamaño: ${size}`
            : `Tipos permitidos: ${types} • Tamaño: ${size}`;
    }

    /** ---- Drag & Drop ---- */
    onDragOver(evt: DragEvent) {
        if (this.disabled) return;
        evt.preventDefault();
        this.dragActive = true;
    }
    onDragLeave(_: DragEvent) {
        this.dragActive = false;
    }
    onDrop(evt: DragEvent) {
        if (this.disabled) return;
        evt.preventDefault();
        this.dragActive = false;
        const files = evt.dataTransfer?.files;
        if (files && files.length) this.addFiles(files);
    }

    /** ---- Input change ---- */
    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        if (!files || files.length === 0) return;

        this.addFiles(files);

        // Limpiar para permitir re-selección del mismo archivo
        input.value = '';
    }

    /** ---- Core add/validate ---- */
    private addFiles(list: FileList | File[]) {
        const incoming = Array.from(list);
        const validFiles: File[] = [];

        for (const file of incoming) {
            if (this.validateFile(file) && !this.isDuplicate(file)) {
                validFiles.push(file);
            }
        }

        if (!validFiles.length) return;

        if (this.multiple) {
            this.fileList = [...(this.fileList || []), ...validFiles];
            this.value = this.fileList;
        } else {
            this.clearAllObjectUrls(); // reemplazo único ⇒ limpia previews anteriores
            this.fileList = [validFiles[0]];
            this.value = validFiles[0];
        }

        this.onChange(this.value);
        this.onTouched();
        this.fileSelected.emit(this.multiple ? validFiles : validFiles[0]);

        if (this.formControl && this.formControl.value !== this.value) {
            this.formControl.setValue(this.value, { emitEvent: false });
        }
    }

    private isDuplicate(f: File): boolean {
        return this.fileList.some(x =>
            x.name === f.name && x.size === f.size && x.lastModified === f.lastModified
        );
    }

    /** Validación con soporte de comodines en accept (p.ej. image/*) */
    private validateFile(file: File): boolean {
        const max = this.maxSizeMB * 1024 * 1024;
        if (file.size > max) {
            const msg = `El archivo "${file.name}" excede ${this.maxSizeMB}MB.`;
            this.fileError.emit(msg);
            return false;
        }

        if (this.accept?.trim()) {
            const tokens = this.accept.split(',').map(t => t.trim().toLowerCase());
            const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
            const mime = (file.type || '').toLowerCase();

            const pass = tokens.some(t => {
                if (!t) return false;
                // .ext
                if (t.startsWith('.')) return t === ext;
                // tipo/*
                if (t.endsWith('/*')) {
                    const prefix = t.replace('/*', '');
                    return mime.startsWith(prefix + '/');
                }
                // mime exacto o substring razonable
                return mime === t || mime.includes(t);
            });

            if (!pass) {
                const msg = `El archivo "${file.name}" no coincide con los tipos permitidos: ${this.accept}`;
                this.fileError.emit(msg);
                return false;
            }
        }

        return true;
    }

    /** ---- Preview / download / icons ---- */
    isImage(file: File) { return /^image\//.test(file.type); }
    isPreviewable(file: File) {
        return this.isImage(file) || file.type === 'application/pdf' || file.type.startsWith('text/') || file.type === 'application/json' || file.type === 'application/xml';
    }

    private ensureUrl(file: File): string {
        if (!this.objectUrls.has(file)) this.objectUrls.set(file, URL.createObjectURL(file));
        return this.objectUrls.get(file)!;
    }
    getPreviewUrl(file: File) { return this.ensureUrl(file); }

    downloadFile(file: File): void {
        const url = this.ensureUrl(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // no revocamos aquí para permitir re-descarga; se revoca al remover/destruir
    }

    previewFile(file: File): void {
        const url = this.ensureUrl(file);
        const fileName = file.name;
        const fileType = file.type;

        const win = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (!win) {
            alert('Permite ventanas emergentes para ver la vista previa.');
            return;
        }

        if (fileType.startsWith('image/')) {
            win.document.write(`
        <!doctype html><html><head><title>${fileName}</title>
        <style>body{margin:0;background:#f5f5f5;font-family:system-ui,sans-serif}
        img{max-width:100%;display:block;margin:auto;}</style></head>
        <body><img src="${url}" alt="${fileName}"></body></html>
      `);
        } else if (fileType === 'application/pdf') {
            win.document.write(`
        <!doctype html><html><head><title>${fileName}</title></head>
        <body style="margin:0"><iframe src="${url}" style="border:0;width:100%;height:100vh"></iframe></body></html>
      `);
        } else if (fileType.startsWith('text/') || fileType === 'application/json' || fileType === 'application/xml') {
            const reader = new FileReader();
            reader.onload = e => {
                const content = e.target?.result as string;
                win.document.write(`
          <!doctype html><html><head><title>${fileName}</title>
          <style>body{margin:0;background:#f8f9fa}
          pre{white-space:pre-wrap;word-wrap:break-word;background:#fff;margin:1rem;padding:1rem;border-radius:.5rem}
          </style></head><body><pre>${this.escapeHtml(content)}</pre></body></html>
        `);
            };
            reader.readAsText(file);
        } else {
            win.document.write(`
        <!doctype html><html><head><title>${fileName}</title>
        <style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:system-ui}</style></head>
        <body><div><h3>${fileName}</h3><p>Tipo: ${fileType || 'Desconocido'}</p></div></body></html>
      `);
        }
    }

    private escapeHtml(s: string) {
        return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!));
    }

    /** Mantengo tu getFileIcon tal cual (puedes ajustar si deseas) */
    getFileIcon(file: File): string {
        const extension = file.name.split('.').pop()?.toLowerCase();
        const mimeType = (file.type || '').toLowerCase();

        if (mimeType.startsWith('image/')) return 'ti ti-photo';
        if (mimeType === 'application/pdf') return 'ti ti-file-type-pdf';
        if (mimeType.includes('word') || extension === 'doc' || extension === 'docx') return 'ti ti-file-type-doc';
        if (mimeType.includes('excel') || extension === 'xls' || extension === 'xlsx') return 'ti ti-file-type-xls';
        if (mimeType.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return 'ti ti-file-type-ppt';
        if (mimeType.startsWith('text/') || extension === 'txt' || extension === 'md') return 'ti ti-file-text';
        return 'ti ti-file';
    }

    /** ---- Remove ---- */
    removeFile(index: number): void {
        if (index < 0 || index >= this.fileList.length) return;
        const removed = this.fileList[index];
        this.fileList.splice(index, 1);

        // Actualizar valor
        if (this.multiple) {
            this.value = this.fileList.length ? this.fileList : null;
        } else {
            this.value = null;
        }

        // Notificar
        this.onChange(this.value);
        this.onTouched();
        this.fileRemoved.emit(removed);
        this.revokeUrl(removed);

        if (this.formControl) this.formControl.setValue(this.value, { emitEvent: false });
    }

    /** ---- Errors ---- */
    getErrors(): { message: string }[] {
        if (this.control && this.control.errors && this.control.touched) {
            const keys = Object.keys(this.control.errors);
            const unique = keys.filter((v, i, self) => self.indexOf(v) === i);
            return unique.map(k => (this.control?.errors ? (this.control.errors as any)[k] : ''));
        }
        return [];
    }

    /** ---- URL cleanup ---- */
    private revokeUrl(file: File) {
        const url = this.objectUrls.get(file);
        if (url) {
            URL.revokeObjectURL(url);
            this.objectUrls.delete(file);
        }
    }
    private clearAllObjectUrls() {
        for (const [, url] of this.objectUrls) URL.revokeObjectURL(url);
        this.objectUrls.clear();
    }

    formatFileSize(size: number) {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
}
