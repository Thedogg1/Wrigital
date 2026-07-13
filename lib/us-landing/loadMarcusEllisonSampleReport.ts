import fs from 'fs';
import path from 'path';

export interface MarcusEllisonSampleAttachment {
  filename: string;
  content: Buffer;
}

const SEARCH_PATHS = [
  path.join(process.cwd(), 'public', 'USA_General_Main_Report.pdf'),
  path.join(process.cwd(), 'public', 'us-landing', 'USA_General_Main_Report.pdf'),
  path.join(process.cwd(), 'public', 'demo', 'US_General_Main_Report.pdf'),
  path.join(process.cwd(), 'public', 'demo', 'marcus-ellison-intelligence-report.html'),
];

export function getMarcusEllisonSamplePath(): string {
  return (
    process.env.US_SAMPLE_REPORT_PATH?.trim() ||
    path.join(process.cwd(), 'public', 'USA_General_Main_Report.pdf')
  );
}

export async function loadMarcusEllisonSampleReport(): Promise<MarcusEllisonSampleAttachment> {
  const explicitPath = process.env.US_SAMPLE_REPORT_PATH?.trim();
  const candidates = explicitPath ? [explicitPath, ...SEARCH_PATHS] : SEARCH_PATHS;

  for (const filePath of candidates) {
    try {
      const content = await fs.promises.readFile(filePath);
      return {
        filename: path.basename(filePath),
        content,
      };
    } catch {
      // try next path
    }
  }

  throw new Error(
    'Marcus Ellison sample report not found. Place USA_General_Main_Report.pdf in public/us-landing/',
  );
}
