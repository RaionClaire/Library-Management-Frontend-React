import React from "react";
import "../styles/totalBuku.css";

const TotalBuku = () => {
  const data = [
    { label: "Total Buku", value: 250, color: "#b3e5fc" },
    { label: "Buku Tersedia", value: 180, color: "#c8e6c9" },
    { label: "Buku Dipinjam", value: 70, color: "#ffab91" },
    { label: "Kategori Buku", value: 5, color: "#cfd8dc" },
    { label: "Penerbit Terdaftar", value: 20, color: "#fff9c4" },
  ];

  return (
    <div className="container-totalbuku">
      <h2 className="judul">Peminjaman Buku</h2>
      <div className="grid-totalbuku">
        {data.map((item, index) => (
          <div
            key={index}
            className="card"
            style={{ backgroundColor: item.color }}
          >
            <p className="label">{item.label}</p>
            <h3 className="value">{item.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalBuku;
