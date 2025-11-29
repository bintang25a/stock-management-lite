import { Product, Food } from "../public/scripts/core.js";

describe("Unit Testing: Product and Food Classes (OOP Logic)", () => {
  test("Kriteria H: Product harus memiliki properti dasar", () => {
    const p = new Product(1, "Pensil", 2500, 10);
    expect(p.name).toBe("Pensil");
    expect(p.price).toBe(2500);
  });

  test("Kriteria H: Food harus mewarisi (Inheritance) dari Product", () => {
    const f = new Food(2, "Roti", 10000, 5, "2025-12-31");
    expect(f instanceof Product).toBe(true);
  });

  test("Kriteria H: Food harus menerapkan Polymorphism (showDetail)", () => {
    const p = new Product(1, "Meja", 500000, 2);
    expect(p.showDetail()).toBe("Produk Umum");

    const expiredFood = new Food(3, "Susu", 15000, 10, "2020-01-01");
    expect(expiredFood.showDetail()).toContain("EXPIRED");

    const freshFood = new Food(4, "Keju", 20000, 5, "2030-01-01");
    expect(freshFood.showDetail()).toContain("Okay");
  });
});
