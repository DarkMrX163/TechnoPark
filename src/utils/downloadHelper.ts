/**
 * Triggers direct browser download of the standalone offline quiz HTML
 * using Blob to prevent cross-site navigation issues or Cloud Run cookie blocks.
 */
export async function downloadStandaloneQuizFile(): Promise<boolean> {
  try {
    const response = await fetch('/quantum_dobra_quiz.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quantum_dobra_quiz.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (error) {
    console.error('Download error:', error);
    // Fallback: direct window download navigation
    const fallbackLink = document.createElement('a');
    fallbackLink.href = '/quantum_dobra_quiz.html';
    fallbackLink.download = 'quantum_dobra_quiz.html';
    fallbackLink.target = '_self';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
    return false;
  }
}
