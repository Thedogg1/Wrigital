function waitForIframeLoad(iframe: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve) => {
    iframe.onload = () => resolve();
    setTimeout(resolve, 300);
  });
}

export async function downloadSnapshotPdf(
  html: string,
  filename = 'exit-snapshot.pdf',
): Promise<void> {
  if (typeof window === 'undefined') return;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText =
    'position:fixed;left:-9999px;top:0;width:800px;height:0;border:0;visibility:hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error('Could not create PDF document');
  }

  doc.open();
  doc.write(html);
  doc.close();
  await waitForIframeLoad(iframe);

  const { default: html2pdf } = await import('html2pdf.js');

  await html2pdf()
    .set({
      margin: [12, 12, 12, 12],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    })
    .from(doc.body)
    .save();

  document.body.removeChild(iframe);
}
