import fs from 'fs';
import path from 'path';

export interface RobertHartleySampleAttachment {
  filename: string;
  content: Buffer;
}

const SEARCH_PATHS = [
  path.join(process.cwd(), 'public', 'UK_General_Main_Report.pdf'),
  path.join(process.cwd(), 'public', 'demo', 'UK_General_Main_Report.pdf'),
  path.join(process.cwd(), 'public', 'demo', 'robert-hartley-intelligence-report.html'),
];

export function getRobertHartleySamplePath(): string {
  return (
    process.env.UK_ROBERT_HARTLEY_REPORT_PATH?.trim() ||
    path.join(process.cwd(), 'public', 'UK_General_Main_Report.pdf')
  );
}

export async function loadRobertHartleySampleReport(): Promise<RobertHartleySampleAttachment> {
  const explicitPath = process.env.UK_ROBERT_HARTLEY_REPORT_PATH?.trim();
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
    'Robert Hartley sample report not found. Place UK_General_Main_Report.pdf in public/demo/',
  );
}
