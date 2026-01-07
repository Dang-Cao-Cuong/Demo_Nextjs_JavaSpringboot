import React from "react";
import './index.css'
import { Card, Spin, Table } from 'antd';
import { useMachines } from '@/hooks/useMachine'; // Import hook


interface CNCMachine {
  id: string;
  status: "Hoạt động" | "Lỗi" | "Không hoạt động";
  model: string;
  location: string;
  year: number;
}

const machines: CNCMachine[] = [
  { id: "CNC-01", status: "Hoạt động", model: "MD_1", location: "B1", year: 1990 },
  { id: "CNC-02", status: "Lỗi", model: "Y", location: "ABC", year: 2026 },
  { id: "CNC-02", status: "Không hoạt động", model: "Y", location: "ABC", year: 2026 },
];

const totalMachines = machines.length;

const runningMachines = machines.filter(
  (m) => m.status === "Hoạt động"
).length;

const errorMachines = machines.filter(
  (m) => m.status === "Lỗi"
).length;

const statusClass: Record<string, string> = {
  "Hoạt động": "running",
  "Lỗi": "stopped",
  "Không hoạt động": "norun",
};

const App: React.FC = () => {
  return (
    <div className="app">
      <main className="container">
        <div className="summary">
          <div className="card">
            Tổng máy <br />
            <b>{totalMachines}</b>
          </div>

          <div className="card">
            Đang hoạt động <br />
            <b>{runningMachines}</b>
          </div>

          <div className="card">
            Lỗi <br />
            <b>{errorMachines}</b>
          </div>
        </div>
        <h1>Danh sách máy CNC</h1>

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
                <td className={`status ${statusClass[m.status]}`}>
                  {m.status}
                </td>
                <td>{m.model}</td>
                <td>{m.location}</td>
                <td>{m.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="layout">
          <aside className="sidebar">
            <h3>Mục lục</h3>
            <ul>
              <li><a href="#">Tổng quan CNC</a></li>
              <li><a href="#">Cấu tạo CNC</a></li>
            </ul>
            <button id="registerBtn">Thêm người dùng</button>
          </aside>
          <section className="content" id="A1">
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
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">

          <div className="footer-col">
            <h3>Hệ thống CNC</h3>
            <p>
              Phần mềm quản lý máy CNC giúp theo dõi trạng thái máy,
              tiến độ gia công và tối ưu hiệu suất sản xuất.
            </p>
          </div>


          <div className="footer-col">
            <h3>Chức năng</h3>
            <ul>
              <li><a href="#">Quản lý máy CNC</a></li>
              <li><a href="#">Lịch gia công</a></li>
              <li><a href="#">Báo cáo sản xuất</a></li>
              <li><a href="#">Bảo trì máy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Hỗ trợ</h3>
            <ul>
              <li><a href="#">Hướng dẫn sử dụng</a></li>
              <li><a href="#">Tài liệu CNC</a></li>
              <li><a href="#">Liên hệ kỹ thuật</a></li>
            </ul>
          </div>


          <div className="footer-col">
            <h3>Liên hệ</h3>
            <p>🏭 Xưởng CNC: Bình Dương</p>
            <p>📞 Hotline: 090x xxx xxx</p>
            <p>✉ Email: support@cnc-system.vn</p>
          </div>

        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} CNC Management System | Designed by Your Team
        </div>
      </footer>

    </div>
  );
};

export default App;
