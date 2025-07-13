import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
export default function Summary() {
  const { secureFetch } = useAuth();
  const [songs, setSongs] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await secureFetch(
        "http://localhost:3000/api/songs/artist-songs"
      );
      const data = await res.json();
      setSongs(data.songs);
    };
    fetchSongs();
  }, []);

  const handlePDFDownload = () => {
    const element = tableRef.current;
    if (!element) return;

    // Wait for all images to load
    const images = element.querySelectorAll("img");
    const imageLoadPromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    });

    Promise.all(imageLoadPromises).then(() => {
      const opt = {
        margin: 0.5,
        filename: "songs.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().from(element).set(opt).save();
    });
  };

  const handleExcelDownload = () => {
    const worksheetData = songs.map((song) => ({
      Title: song.title,
      "Play Count": song.play_count,
      Thumbnail: `http://localhost:3000${song.thumbnail}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Songs");

    XLSX.writeFile(workbook, "songs.xlsx");
  };

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h2
        style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Song List Preview
      </h2>

      <div ref={tableRef}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead style={{ backgroundColor: "#f3f3f3" }}>
            <tr>
              <th style={cellStyle}>Thumbnail</th>
              <th style={cellStyle}>Title</th>
              <th style={cellStyle}>Play Count</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id}>
                <td style={cellStyle}>
                  <img
                    src={`http://localhost:3000${song.thumbnail}`}
                    alt="thumb"
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td style={cellStyle}>{song.title}</td>
                <td style={cellStyle}>{song.play_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
        <button
          onClick={handlePDFDownload}
          style={{
            padding: "10px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Download as PDF
        </button>
        <button
          onClick={handleExcelDownload}
          style={{
            padding: "10px 16px",
            backgroundColor: "#059669", // green-600
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Download as Excel
        </button>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  textAlign: "left",
};
