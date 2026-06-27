import type { EditorProject } from './useEditorStore';

export function exportGame(project: EditorProject): string {
    return JSON.stringify(project, null, 2);
}

export function downloadGame(project: EditorProject): void {
    const json = exportGame(project);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
