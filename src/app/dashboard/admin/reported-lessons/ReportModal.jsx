"use client";

import { useState } from "react";

export default function ReportModal({ reports }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-blue-600 px-3 py-1 text-white"
      >
        View Reasons
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white text-amber-500 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Reported Reasons</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="rounded border p-4"
                >
                  <p>
                    <span className="font-semibold">
                      Reporter:
                    </span>{" "}
                    {report.reporterName}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Email:
                    </span>{" "}
                    {report.reporterEmail}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Reason:
                    </span>{" "}
                    {report.reason}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}