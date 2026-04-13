/**
 * Diario Espiritual Pro v1.0
 * Asociación Apóstoles de la Divina Misericordia
 */

function initJournal() {
    const editor = document.getElementById('journal-editor');
    const saveStatus = document.getElementById('save-status');
    const exportBtn = document.getElementById('export-txt');

    if (!editor) return;

    // Cargar contenido guardado
    editor.value = localStorage.getItem('spiritual_journal') || '';

    // Guardado automático (Debounce simple)
    let timeout;
    editor.addEventListener('input', () => {
        if (saveStatus) saveStatus.innerText = 'Escribiendo...';
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            localStorage.setItem('spiritual_journal', editor.value);
            if (saveStatus) saveStatus.innerText = 'Santuario Guardado';
        }, 1000);
    });

    // Exportar reflexiones
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const text = editor.value;
            const blob = new Blob([text], { type: 'text/plain' });
            const anchor = document.createElement('a');
            anchor.download = `Reflexiones_Misericordia_${new Date().toLocaleDateString()}.txt`;
            anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
            anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
            anchor.click();
        });
    }
}

document.addEventListener('DOMContentLoaded', initJournal);
