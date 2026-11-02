import {
  DASHBOARD_EXPORT,
  DASHBOARD_EXPORT_FORMATS,
} from '@/shared/constants/dashboard';
import {
  DashboardExportArgs,
  DashboardExportDataArgs,
  DashboardExportTable,
  JsPdfWithAutoTable,
} from '@/shared/interfaces/dashboard';
import {DateTime} from '@/shared/utils/dateUtils';

// Quotes a CSV cell per RFC 4180 when it contains the delimiter, a quote, or a
// newline; embedded quotes are doubled. Coerces first so a nullish or
// non-string cell (the table type promises strings, but data doesn't always
// cooperate) doesn't throw on `.includes` and take down the whole export.
const escapeCsvCell = ({cell}: {cell: unknown}): string => {
  const {
    delimiter,
    quote,
    escapedQuote,
    newline,
    formulaTriggerChars,
    formulaEscapePrefix,
  } = DASHBOARD_EXPORT.csv;
  const raw = cell == null ? '' : String(cell);

  const value = formulaTriggerChars.some((char) => raw.startsWith(char))
    ? `${formulaEscapePrefix}${raw}`
    : raw;

  const needsQuoting =
    value.includes(delimiter) ||
    value.includes(quote) ||
    value.includes(newline);

  if (!needsQuoting) return value;

  return `${quote}${value.replaceAll(quote, escapedQuote)}${quote}`;
};

// The report title line, then one CSV block per table (section title line,
// header row, data rows) with a blank line between blocks. The BOM prefix
// keeps Excel reading the file as UTF-8.
const buildCsvContent = ({
  title,
  tables,
}: {
  title: string;
  tables: DashboardExportTable[];
}): string => {
  const {delimiter, lineBreak, bom} = DASHBOARD_EXPORT.csv;

  const blocks = tables.map(({title, head, body}) => {
    const rows: string[][] = [[title], head].concat(body);

    return rows
      .map((row) => row.map((cell) => escapeCsvCell({cell})).join(delimiter))
      .join(lineBreak);
  });

  return `${bom}${[escapeCsvCell({cell: title})]
    .concat(blocks)
    .join(lineBreak + lineBreak)}`;
};

// Triggers a browser download of the given blob via a transient anchor. The
// anchor has to be attached to the document for `.click()` to reliably fire
// a download in every browser (Firefox/Safari ignore clicks on a detached
// node), and the object URL has to outlive the click, so revocation is
// deferred rather than run synchronously right after.
const downloadBlob = ({
  blob,
  fileName,
}: {
  blob: Blob;
  fileName: string;
}): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 0);
};

// Stamps the download with today's date so repeated exports don't shadow each
// other (e.g. admin-dashboard-report-2026-07-16.csv).
const buildExportFileName = ({
  baseName,
  extension,
}: {
  baseName: string;
  extension: string;
}): string => {
  const dateStamp = DateTime.now().toFormat(
    DASHBOARD_EXPORT.fileNameDateFormat
  );

  return `${baseName}${DASHBOARD_EXPORT.fileNameSeparator}${dateStamp}.${extension}`;
};

const exportDashboardToCsv = ({
  title,
  fileName,
  tables,
}: DashboardExportArgs): void => {
  const {extension, mimeType} = DASHBOARD_EXPORT.csv;
  const blob = new Blob([buildCsvContent({title, tables})], {type: mimeType});

  downloadBlob({
    blob,
    fileName: buildExportFileName({baseName: fileName, extension}),
  });
};

// A brand header band, then one themed autotable per section, with page
// numbers in the footer. jspdf is imported lazily to keep it out of the bundle.
const exportDashboardToPdf = async ({
  title,
  subtitle,
  fileName,
  tables,
}: DashboardExportArgs): Promise<void> => {
  const {jsPDF} = await import('jspdf');
  const {default: autoTable} = await import('jspdf-autotable');
  const {pdf} = DASHBOARD_EXPORT;
  const {colors} = pdf;

  const doc = new jsPDF({unit: pdf.unit, format: pdf.format});
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont(pdf.font, 'bold');
  doc.setFontSize(pdf.titleFontSize);

  const titleLines: string[] = doc.splitTextToSize(
    title,
    pageWidth - pdf.margin * 2
  );

  const titleHeight = titleLines.length * pdf.titleLineHeight;

  const bandHeight =
    pdf.bandPaddingY * 2 +
    titleHeight +
    (subtitle ? pdf.subtitleGap + pdf.subtitleFontSize : 0);

  doc.setFillColor(colors.band);
  doc.rect(0, 0, pageWidth, bandHeight, 'F');
  doc.setTextColor(colors.bandText);

  doc.text(titleLines, pdf.margin, pdf.bandPaddingY + pdf.titleFontSize, {
    lineHeightFactor: pdf.titleLineHeight / pdf.titleFontSize,
  });

  if (subtitle) {
    doc.setFont(pdf.font, 'normal');
    doc.setFontSize(pdf.subtitleFontSize);
    doc.setTextColor(colors.bandSubtext);
    doc.text(subtitle, pdf.margin, bandHeight - pdf.bandPaddingY);
  }

  let cursorY = bandHeight + pdf.titleGap;

  tables.forEach(({title: sectionTitle, head, body}) => {
    if (cursorY > pageHeight - pdf.margin - pdf.minSectionSpace) {
      doc.addPage();
      cursorY = pdf.margin;
    }

    doc.setFont(pdf.font, 'bold');
    doc.setFontSize(pdf.sectionTitleFontSize);
    doc.setTextColor(colors.sectionTitle);
    doc.text(sectionTitle, pdf.margin, cursorY);

    autoTable(doc, {
      head: [head],
      body,
      startY: cursorY + pdf.sectionTitleGap,
      margin: pdf.margin,
      theme: 'grid',
      styles: {
        font: pdf.font,
        fontSize: pdf.tableFontSize,
        textColor: colors.text,
        lineColor: colors.line,
        lineWidth: pdf.tableLineWidth,
      },
      headStyles: {fillColor: colors.headFill, textColor: colors.headText},
      alternateRowStyles: {fillColor: colors.rowAlt},
    });

    cursorY =
      ((doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? cursorY) +
      pdf.sectionGap;
  });

  const pageCount = doc.getNumberOfPages();

  doc.setFont(pdf.font, 'normal');
  doc.setFontSize(pdf.footerFontSize);
  doc.setTextColor(colors.muted);

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);

    doc.text(
      `${page} / ${pageCount}`,
      pageWidth - pdf.margin,
      pageHeight - pdf.footerOffset,
      {align: 'right'}
    );
  }

  doc.save(buildExportFileName({baseName: fileName, extension: pdf.extension}));
};

// Routes a dashboard export to its serializer. Async because the PDF path
// lazy-loads jspdf.
export const exportDashboardData = async ({
  format,
  title,
  subtitle,
  fileName,
  tables,
}: DashboardExportDataArgs): Promise<void> => {
  if (format === DASHBOARD_EXPORT_FORMATS.CSV) {
    exportDashboardToCsv({title, fileName, tables});

    return;
  }

  await exportDashboardToPdf({title, subtitle, fileName, tables});
};
