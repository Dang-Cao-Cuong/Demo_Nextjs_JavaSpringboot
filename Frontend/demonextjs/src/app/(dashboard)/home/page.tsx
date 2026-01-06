import React from "react";
import './index.css'

interface CNCMachine {
  id: string;
  status: "Ổn định" | "Lỗi";
  model: string;
  location: string;
  year: number;
}

const username: string = "nguyenvana";

const machines: CNCMachine[] = [
  { id: "CNC-01", status: "Ổn định", model: "MD_1", location: "B1", year: 1990 },
  { id: "CNC-02", status: "Lỗi", model: "Y", location: "ABC", year: 2026 },
];

const App: React.FC = () => {
  return (
    <div className="app">
      <main className="container">
        <div className="summary">
          <div className="card">Tổng máy<br /><b>2</b></div>
          <div className="card">Đang hoạt động<br/><b>2</b></div>
          <div className="card">Ổn định<br /><b>1</b></div>
          <div className="card">Lỗi<br /><b>1</b></div>
        </div>

        <h2>Danh sách máy CNC</h2>

        <table>
          <thead>
            <tr>
              <th>Mã máy</th>
              <th>Trạng thái</th>
              <th>Mẫu</th>
              <th>Vị trí</th>
              <th>Năm sản suất</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td className={
                  m.status === "Ổn định"
                    ? "warning"
                      : "stopped"
                }>
                  {m.status}
                </td>
                <td>{m.model}</td>
                <td>{m.location}</td>
                <td>{m.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="general">
            <h2><b>1. Tổng quan về máy CNC</b></h2>
            <p>CNC là viết tắt của  Computer Numerical Control, là một dạng máy được điều khiển tự động thông qua lập trình trên máy tính. Máy CNC có khả năng gia công phay, cắt, gọt, khoan,… các vật liệu kim loại với độ chính xác cao và tốc độ nhanh. Công nghệ CNC đang là một giải pháp tối ưu cho nền công nghiệp cơ khí Việt Nam hiện nay.</p>
            <p>Máy CNC phổ biến như hiện nay là do máy có nhiều ưu điểm hơn máy cơ khí truyền thống, và mang lại nhiều lợi ích cho doanh nghiệp. Các lợi ích có thể kể như tự động hóa dây chuyền, tiết kiệm được chi phí sản xuất, chất lượng sản phẩm được nâng cao.</p>
            <p>Có 3 loại máy CNC phổ biến, được sử dụng nhiều nhất ở các công xưởng hiện nay:  Máy phay CNC, máy tiện CNC, máy khoan phay CNC.</p>
            <p>Ngoài ra còn có những loại máy với những ưu điểm và chức năng riêng biệt khác. Xem thêm các loại máy CNC nhập khẩu.</p>
            <h2><b>2. Cấu tạo máy CNC cơ bản</b></h2>
            <p>Mỗi loại sẽ có những cấu tạo riêng nhưng nhìn chung sẽ có 2 phần cơ bản sau:</p>
            <ul>
              <li>
                Phần chấp hành: Đế máy, thân máy, bàn máy, bàn xoay, trục vít me bi, ổ tích dụng cụ, cụm trục chính và băng dẫn hướng.
              </li>
              <li>Phần điều khiển: các loại động cơ, các hệ thống điều khiển và máy tính trung tâm.</li>
            </ul>
            <img src="https://maycncnhapkhau.com/wp-content/uploads/2021/04/cau-tao-may-cnc-4.jpg" alt="" />
        </section>
      </main>

      <footer className="footer">Dự án demo CNC – React + TypeScript</footer>
    </div>
  );
};

export default App;
