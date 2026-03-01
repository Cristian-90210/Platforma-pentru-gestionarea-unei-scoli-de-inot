/**
 * Generează și descarcă un fișier CSV din orice array de obiecte.
 * Folosește ; ca separator — compatibil cu Excel din România/Europa.
 * @param data     - Array de obiecte cu câmpuri plate
 * @param filename - Numele fișierului (fără extensie)
 */
export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string
): void {
    if (!data.length) return;

    const SEP = ';';
    const headers = Object.keys(data[0]);

    const escape = (val: unknown): string => {
        const str = val === null || val === undefined ? '' : String(val);
        // Dacă conține separatorul, ghilimele sau newline — înfășurăm în ghilimele
        if (str.includes(SEP) || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const rows = [
        `sep=${SEP}`,                                          // directivă Excel pentru separator
        headers.join(SEP),
        ...data.map(row => headers.map(h => escape(row[h])).join(SEP)),
    ];

    const csvContent = '\uFEFF' + rows.join('\r\n'); // \uFEFF = BOM pentru Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
