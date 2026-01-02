import React, { useState } from "react";
import UserInfo from "./UserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  status: string;
}

const username = "nguyenvana";

const Quiz: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1001,
      name: "Transistor",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Transistors.agr.jpg/500px-Transistors.agr.jpg",
      price: 1500,
      status: "Đang hoạt động",
    },
  ]);

  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("new");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState<Product>({
    id: 0,
    name: "",
    image: "",
    price: 0,
    status: "Đang hoạt động",
  });

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    let result = [...products].filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    if (sortType === "az")
      result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortType === "za")
      result.sort((a, b) => b.name.localeCompare(a.name));

    setProducts(result);
  };

  /* ================= SORT ================= */
  const handleSort = (value: string) => {
    setSortType(value);
    let sorted = [...products];

    if (value === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (value === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    if (value === "new") sorted.sort((a, b) => b.id - a.id);

    setProducts(sorted);
  };

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      id: 0,
      name: "",
      image: "",
      price: 0,
      status: "Đang hoạt động",
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm(p);
    setModalOpen(true);
  };

  const saveProduct = () => {
    if (!form.name || !form.price) return alert("Nhập đủ thông tin!");

    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === form.id ? form : p))
      );
    } else {
      setProducts([
        ...products,
        { ...form, id: Date.now() },
      ]);
    }

    setModalOpen(false);
  };

  const deleteProduct = (id: number) => {
    if (confirm("Xóa sản phẩm?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <UserInfo username={username} />

      {/* ===== NAV ===== */}
      <section className="nav">
        <button onClick={openAddModal} id="add">
          <FontAwesomeIcon icon={faPlus} /> Thêm sản phẩm
        </button>

        <select onChange={(e) => handleSort(e.target.value)}>
          <option value="new">Mới nhất</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
        </select>

        <input
          placeholder="Nhập tên sản phẩm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button onClick={handleSearch} id="searchPro">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </section>

      {/* ===== TABLE ===== */}
      <table className="my-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Tên</th>
            <th>Ảnh</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td><img src={p.image} width={50} /></td>
              <td>{p.price.toLocaleString()} VND</td>
              <td>{p.status}</td>
              <td>
                <button onClick={() => openEditModal(p)} id="edit">
                  <FontAwesomeIcon icon={faPenToSquare} /> edit
                </button>
                <button onClick={() => deleteProduct(p.id)} id="delete">
                  <FontAwesomeIcon icon={faTrashCan} /> delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-box">
            <h3>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>

            <input
              placeholder="Tên sản phẩm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Link hình ảnh"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <input
              type="number"
              placeholder="Giá"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />

            <div className="modal-actions">
              <button onClick={saveProduct}>Lưu</button>
              <button onClick={() => setModalOpen(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
