/**
 * =========================================================
 * 📦 IMLite.Model & IMLite.Core (OOP, Inheritance, Array)
 * =========================================================
 */

// Import dari core.js
import { Product, Food, StockManager } from "./core.js";

/**
 * =========================================================
 * 🖥️ IMLite.App (Antarmuka Pengguna/DOM Manipulation)
 * =========================================================
 */

const manager = new StockManager(); // Inisiasi program
const addForm = document.getElementById("add-product-form");
const tableBody = document.getElementById("table-body");
const tableBodyLocal = document.getElementById("table-body-local");
const productTypeInput = document.getElementById("product-type");
const expiredDateInput = document.getElementById("expired-date");

// --- Fungsi DOM ---

// Fungsi untuk memperbarui tampilan tabel
async function showProducts() {
  try {
    const products = await manager.loadProducts(); // Panggil fungsi API baru
    tableBody.innerHTML = ""; // Pengulangan (forEach) untuk menampilkan data

    products.forEach((product) => {
      const row = tableBody.insertRow(); // Memformat tampilan data

      row.insertCell().textContent = product.id;
      row.insertCell().textContent = product.name; // Tipe Data: Menggunakan toLocaleString untuk format mata uang
      row.insertCell().textContent = `Rp ${product.price.toLocaleString(
        "id-ID"
      )}`;
      row.insertCell().textContent = product.stock; // Menerapkan Polymorphism: Memanggil method tampilkanDetail() dari kelas yang sesuai

      row.insertCell().textContent = product.showDetail();

      const actionCell = row.insertCell();
      const deleteBtn = document.createElement("button");

      deleteBtn.innerText = "Hapus";
      deleteBtn.className = "btn btn-danger btn-sm";

      deleteBtn.addEventListener("click", async () => {
        try {
          await manager.deleteProduct(product.id);
        } catch (error) {
          alert("Data gagal dihapus dari database");
        } finally {
          await showProducts();
        }
      });

      actionCell.appendChild(deleteBtn);
    });
  } catch (error) {
    console.error("Error memuat data:", error);
  }
}

function showProductsLocal() {
  try {
    let products = [];
    products = localStorage.getItem("products");
    products = JSON.parse(products);

    tableBodyLocal.innerHTML = "";

    products.forEach((product) => {
      const row = tableBodyLocal.insertRow(); // Memformat tampilan data

      row.insertCell().textContent = product.id;
      row.insertCell().textContent = product.name; // Tipe Data: Menggunakan toLocaleString untuk format mata uang
      row.insertCell().textContent = `Rp ${product.price.toLocaleString(
        "id-ID"
      )}`;
      row.insertCell().textContent = product.stock; // Menerapkan Polymorphism: Memanggil method tampilkanDetail() dari kelas yang sesuai

      const actionCell = row.insertCell();
      const deleteBtn = document.createElement("button");

      deleteBtn.innerText = "Hapus";
      deleteBtn.className = "btn btn-danger btn-sm";

      deleteBtn.addEventListener("click", () => {
        const filterProducts = products.filter(
          (item) => item.id !== product.id
        );
        localStorage.setItem("products", JSON.stringify(filterProducts));

        alert("Data berhasil dihapus dari Local Storage");
        showProductsLocal();
      });

      actionCell.appendChild(deleteBtn);
    });
  } catch (error) {
    console.error("Error memuat data:", error);
  }
}

// --- Event Listeners ---

// 1. Kontrol Tampilan Input Tambahan
productTypeInput.addEventListener("change", (e) => {
  // Percabangan (if...else)
  if (e.target.value === "Makanan") {
    expiredDateInput.style.display = "block";
    expiredDateInput.setAttribute("required", "required");
  } else {
    expiredDateInput.style.display = "none";
    expiredDateInput.removeAttribute("required");
  }
});

// 2. Event Listener Utama untuk Menambah Produk
addForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Ambil Nilai Input

  const idInput = parseInt(document.getElementById("id").value);
  const nameInput = document.getElementById("name").value;
  const priceInput = parseFloat(document.getElementById("price").value);
  const stockInput = parseInt(document.getElementById("stock").value);
  const type = document.getElementById("product-type").value;

  let newProduct; // Menerapkan Percabangan (Switch) untuk Inheritance

  switch (type) {
    case "Makanan":
      const expDate = document.getElementById("expired-date").value;
      console.log(expDate);
      newProduct = new Food(
        idInput,
        nameInput,
        priceInput,
        stockInput,
        expDate
      );

      break;
    default:
      newProduct = new Product(idInput, nameInput, priceInput, stockInput);
      break;
  }

  try {
    await manager.addProduct(newProduct); // Perbarui Tampilan dan Bersihkan Form
    alert("Data berhasil disimpan ke Database!");
  } catch (error) {
    alert("Data gagal disimpan ke Database!");
  } finally {
    await showProducts();
    addForm.reset();
  }
});

// 3. Event Listener untuk Simpan Data Manual
document.getElementById("save-button").addEventListener("click", async () => {
  const products = await manager.loadProducts();

  localStorage.setItem("products", JSON.stringify(products));

  showProductsLocal();
  alert("Data berhasil disimpan ke Local Storage!");
});

// Panggil fungsi awal saat program dimuat
document.addEventListener("DOMContentLoaded", () => {
  showProducts();
  showProductsLocal();
});
