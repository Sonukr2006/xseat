'use client';

import { useState } from 'react';
import ScreenShell from '../../../components/ScreenShell';
import { apiFetch, apiFetchForm } from '../../../lib/api';

export default function AddTicket() {
  const [form, setForm] = useState({
    trainNumber: '',
    trainName: '',
    travelDate: '',
    sourceStation: '',
    destinationStation: '',
    coachNumber: '',
    seatNumber: '',
    seatType: '',
    ticketStatus: 'CNF',
  });
  const [status, setStatus] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrStatus, setOcrStatus] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [ocrPreview, setOcrPreview] = useState<Record<string, string | number | null> | null>(null);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    try {
      await apiFetch('/ticket/add', { method: 'POST', body: JSON.stringify(form) });
      setStatus('Ticket saved successfully.');
      setForm({
        trainNumber: '',
        trainName: '',
        travelDate: '',
        sourceStation: '',
        destinationStation: '',
        coachNumber: '',
        seatNumber: '',
        seatType: '',
        ticketStatus: 'CNF',
      });
    } catch (err) {
      setStatus('Failed to save ticket.');
    }
  };

  const toDateInputValue = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().slice(0, 10);
  };

  const applyExtracted = (ticket: Record<string, string | number | null>) => {
    setForm((prev) => ({
      ...prev,
      trainNumber: (ticket.trainNumber as string) || prev.trainNumber,
      trainName: (ticket.trainName as string) || prev.trainName,
      travelDate: toDateInputValue(ticket.travelDate as string) || prev.travelDate,
      sourceStation: (ticket.sourceStation as string) || prev.sourceStation,
      destinationStation: (ticket.destinationStation as string) || prev.destinationStation,
      coachNumber: (ticket.coachNumber as string) || prev.coachNumber,
      seatNumber: (ticket.seatNumber as string) || prev.seatNumber,
      seatType: (ticket.seatType as string) || prev.seatType,
      ticketStatus: (ticket.ticketStatus as string) || prev.ticketStatus,
    }));
  };

  const runOcr = async (save: boolean) => {
    setOcrStatus(null);
    setOcrConfidence(null);
    setOcrLoading(true);
    try {
      const formData = new FormData();
      if (ocrText.trim()) formData.append('rawText', ocrText.trim());
      if (ocrFile) formData.append('ticketImage', ocrFile);
      if (save) formData.append('save', 'true');
      const result = await apiFetchForm<{
        ticket: Record<string, string | number | null>;
        confidence?: number;
        parserVersion?: string;
        rawText?: string;
      }>('/ticket/import-ocr', formData);
      if (result.ticket) {
        setOcrPreview(result.ticket);
        applyExtracted(result.ticket);
      }
      if (typeof result.confidence === 'number') {
        setOcrConfidence(result.confidence);
      }
      setOcrStatus(save ? 'OCR import saved.' : 'OCR extraction complete. Review and save if needed.');
    } catch (err) {
      setOcrStatus('OCR import failed.');
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <ScreenShell title="Add Ticket" subtitle="Capture ticket details or upload an IRCTC screenshot.">
      <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
        <div className="card">
          <form className="grid gap-4" onSubmit={submit}>
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Train Number"
              value={form.trainNumber}
              onChange={(event) => updateField('trainNumber', event.target.value)}
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Train Name"
              value={form.trainName}
              onChange={(event) => updateField('trainName', event.target.value)}
            />
            <input
              type="date"
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              value={form.travelDate}
              onChange={(event) => updateField('travelDate', event.target.value)}
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Source Station"
              value={form.sourceStation}
              onChange={(event) => updateField('sourceStation', event.target.value)}
            />
            <input
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
              placeholder="Destination Station"
              value={form.destinationStation}
              onChange={(event) => updateField('destinationStation', event.target.value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Coach"
                value={form.coachNumber}
                onChange={(event) => updateField('coachNumber', event.target.value)}
              />
              <input
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Seat"
                value={form.seatNumber}
                onChange={(event) => updateField('seatNumber', event.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                placeholder="Seat Type (LB/MB/UB)"
                value={form.seatType}
                onChange={(event) => updateField('seatType', event.target.value)}
              />
              <select
                className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink"
                value={form.ticketStatus}
                onChange={(event) => updateField('ticketStatus', event.target.value)}
              >
                <option value="CNF">CNF</option>
                <option value="RAC">RAC</option>
                <option value="WL">WL</option>
              </select>
            </div>
            <button className="mt-2 rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink">
              Save Ticket
            </button>
            {status ? <p className="text-sm text-ink/70">{status}</p> : null}
          </form>
        </div>
        <div className="card">
          <h2 className="section-title">Upload & Extract</h2>
          <p className="mt-2 text-sm text-ink/70">Optional: upload an IRCTC screenshot for quick parsing.</p>
          <div className="mt-6 grid gap-4">
            <input
              type="file"
              accept="image/*"
              className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink"
              onChange={(event) => setOcrFile(event.target.files?.[0] ?? null)}
            />
            <textarea
              className="min-h-[140px] rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink"
              placeholder="Paste OCR text here (optional)."
              value={ocrText}
              onChange={(event) => setOcrText(event.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full border border-ink/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
                onClick={() => runOcr(false)}
                disabled={ocrLoading}
              >
                {ocrLoading ? 'Extracting...' : 'Extract'}
              </button>
              <button
                type="button"
                className="rounded-full bg-teal px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink"
                onClick={() => runOcr(true)}
                disabled={ocrLoading}
              >
                {ocrLoading ? 'Saving...' : 'Import & Save'}
              </button>
            </div>
            {ocrConfidence !== null ? (
              <p className="text-xs text-ink/60">Confidence: {Math.round(ocrConfidence * 100)}%</p>
            ) : null}
            {ocrStatus ? <p className="text-sm text-ink/70">{ocrStatus}</p> : null}
            {ocrPreview ? (
              <div className="rounded-xl border border-ink/10 bg-white/80 p-4 text-xs text-ink/70">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/60">Preview</p>
                <p className="mt-2">Train: {ocrPreview.trainNumber || '-'} {ocrPreview.trainName || ''}</p>
                <p>Date: {toDateInputValue(ocrPreview.travelDate as string) || '-'}</p>
                <p>
                  {ocrPreview.sourceStation || '-'} → {ocrPreview.destinationStation || '-'}
                </p>
                <p>
                  Coach {ocrPreview.coachNumber || '-'} Seat {ocrPreview.seatNumber || '-'} {ocrPreview.ticketStatus || ''}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
