// Kelas Dasar: Menerapkan Properti
export class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  } // Prosedur/Method untuk menampilkan data

  showDetail() {
    return "Produk Umum";
  }
}

// Kelas Anak: Menerapkan Inheritance dari Produk
export class Food extends Product {
  constructor(id, name, price, stock, expired) {
    super(id, name, price, stock);
    this.expiredDate = expired;
  } // Menerapkan Polymorphism (override)

  showDetail() {
    const today = new Date();
    const expiredDate = new Date(this.expiredDate);
    let status = "";

    if (expiredDate < today) {
      status = "EXPIRED";
    } else {
      status = "Okay";
    }

    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = expiredDate.toLocaleDateString("id-ID", options);

    return `Expired date: ${formattedDate} (${status})`;
  }
}

// Logika Bisnis Utama: Menerapkan Array, Fungsi, dan Penyimpanan
export class StockManager {
  constructor() {
    this.API_URL = "/api/products";
    this.idGenerator = 1;
    this.loadProducts(); // Menerapkan Fasilitas Membaca Data
  } // Fungsi untuk menambah produk baru

  async addProduct(newProduct) {
    // Hapus logika idGenerator dan this.products.push
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error("Gagal menambah produk via API.");
    }
    return await response.json();
  }

  async deleteProduct(productId) {
    if (!confirm(`Are you sure delete ID: ${productId}?`)) {
      return;
    }

    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      alert(`Data berhasil dihapus dari database`);
    } else {
      alert("Data gagal dihapus dari Database!");
    }
  }

  async loadProducts() {
    const response = await fetch(this.API_URL);

    if (!response.ok) {
      throw new Error("Gagal memuat data dari API.");
    } // Data dari API (JSON) harus direkonstruksi kembali menjadi objek Class Product/Food

    const productsData = await response.json();

    return productsData.map((item) => {
      // Re-instantiate objek (Penting agar method showDetail() tetap ada)
      if (item.expiredDate) {
        return new Food(
          item.id,
          item.name,
          item.price,
          item.stock,
          item.expiredDate
        );
      }
      return new Product(item.id, item.name, item.price, item.stock);
    });
  }
}
