import request from "supertest";
import app from "../config/index.js";
import { db, Product } from "../config/database.js";

beforeAll(async () => {
  await db.sync({ force: true });
});

afterEach(async () => {
  await Product.destroy({ where: {} });
});

afterAll(async () => {
  await db.close();
});

describe("Testing API CRUD (Kriteria K: Basis Data)", () => {
  const productData1 = {
    id: 1,
    name: "Laptop Test",
    price: 15000000,
    stock: 5,
  };

  const productData2 = {
    id: 2,
    name: "Mouse Gaming",
    price: 500000,
    stock: 50,
  };

  const productDataToDelete = {
    id: 3,
    name: "Keyboard Mechanical (Untuk Hapus)",
    price: 1200000,
    stock: 20,
  };

  const updatePayload = {
    id: 4,
    name: "Laptop Test (UPDATED)",
    price: 16000000,
    stock: 10,
  };

  // ------------------------------------
  // TEST: POST (Create)
  // ------------------------------------

  // Test POST untuk Data 1
  test("POST /api/products harus berhasil membuat produk baru (Data 1)", async () => {
    const response = await request(app)
      .post("/api/products")
      .send(productData1)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.name).toBe(productData1.name);
    expect(response.body.id).toBeDefined();
  });

  // Test POST untuk Data 2
  test("POST /api/products harus berhasil membuat produk baru (Data 2)", async () => {
    const response = await request(app)
      .post("/api/products")
      .send(productData2)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.name).toBe(productData2.name);
    expect(response.body.id).toBeDefined();
  });

  // ------------------------------------
  // TEST: GET (Read All)
  // ------------------------------------

  test("GET /api/products harus mengembalikan daftar produk (3 data)", async () => {
    // Masukkan 3 data secara langsung ke DB untuk tes GET
    await Product.create(productData1);
    await Product.create(productData2);
    await Product.create(productDataToDelete); // Data tambahan

    const response = await request(app)
      .get("/api/products")
      .expect("Content-Type", /json/)
      .expect(200);

    // Sekarang harus ada 3 data
    expect(response.body.length).toBe(3);

    // Memastikan salah satu data ada
    const names = response.body.map((p) => p.name);
    expect(names).toContain(productData1.name);
    expect(names).toContain(productData2.name);
    expect(names).toContain(productDataToDelete.name);
  });

  // ------------------------------------
  // TEST: DELETE
  // ------------------------------------

  test("DELETE /api/products/:id harus berhasil menghapus produk", async () => {
    // Langkah 1: Buat produk yang akan dihapus (productDataToDelete)
    const productToDeleteInstance = await Product.create(productDataToDelete);
    const productId = productToDeleteInstance.id;

    // Langkah 2: Kirim permintaan DELETE
    await request(app).delete(`/api/products/${productId}`).expect(204); // Status 204 No Content

    // Langkah 3: Verifikasi bahwa produk tersebut benar-benar hilang
    const checkProduct = await Product.findByPk(productId);
    expect(checkProduct).toBeNull();
  });
});
