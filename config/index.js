import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { db, Product, connectDB } from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Menentukan __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------
// MIDDLEWARE
// ------------------------------------------

// 1. Middleware penting untuk memproses body JSON dari permintaan API
app.use(express.json());

// 2. Melayani file statis dari folder 'public'
// Klien akan mengakses file di public/
app.use(express.static(path.join(__dirname, "..", "public")));

// ------------------------------------------
// ENDPOINT API (Khusus Data)
// ------------------------------------------

// Endpoint 1: GET /api/products (Mengambil semua data)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["id", "ASC"]] });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Gagal memuat data dari DB: " + error.message,
    });
  }
});

// Endpoint 2: POST /api/products (Menambah data baru)
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({
      message: "Gagal menyimpan produk: " + error.message,
    });
  }
});

// Endpoint 3: DELETE /api/products/:id (Menghapus data)
app.delete("/api/products/:id", async (req, res) => {
  try {
    // 1. Ambil ID dari parameter URL (req.params)
    const productId = req.params.id;

    // 2. Gunakan Product.destroy() dengan klausa WHERE untuk menghapus record
    const deletedRowCount = await Product.destroy({
      where: { id: productId },
    });

    // 3. Cek apakah ada baris yang berhasil dihapus
    if (deletedRowCount === 0) {
      // Jika 0 baris dihapus, produk tidak ditemukan (404 Not Found)
      return res.status(404).json({
        message: `Produk dengan ID ${productId} tidak ditemukan.`,
      });
    }

    // 4. Sukses: Kirim status 204 No Content (standar untuk penghapusan sukses)
    res.status(204).send();
  } catch (error) {
    // 5. Kesalahan Server (misalnya masalah koneksi database)
    res.status(500).json({
      message:
        "Gagal menghapus produk karena kesalahan server: " + error.message,
    });
  }
});

// ------------------------------------------
// INISIASI SERVER
// ------------------------------------------

const startServer = async () => {
  await connectDB();

  await db.sync({ force: false });
  console.log("Basis data dan Model disinkronkan.");

  // Rute utama sekarang akan melayani public/index.html
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/views", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
