import React from "react";
import UserInfo from "./UserInfo";

interface CNCMachine {
  id: string;
  status: "Hoạt động" | "Cảnh báo" | "Ngưng";
  power: number;
  note: string;
}

const username: string = "nguyenvana";

const machines: CNCMachine[] = [
  { id: "CNC-01", status: "Hoạt động", power: 80, note: "Bình thường" },
  { id: "CNC-02", status: "Cảnh báo", power: 60, note: "Nhiệt độ cao" },
  { id: "CNC-03", status: "Ngưng", power: 0, note: "Đang sửa chữa" },
];

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="header">HỆ THỐNG QUẢN LÝ MÁY CNC</header>

      <main className="container">
        <UserInfo username={username} />
        <div className="summary">
          <div className="card">Tổng máy<br /><b>3</b></div>
          <div className="card">Đang hoạt động<br /><b>1</b></div>
          <div className="card">Cảnh báo<br /><b>1</b></div>
          <div className="card">Ngưng<br /><b>1</b></div>
        </div>

        <h2>Danh sách máy CNC</h2>

        <table>
          <thead>
            <tr>
              <th>Mã máy</th>
              <th>Trạng thái</th>
              <th>Công suất</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td className={
                  m.status === "Hoạt động"
                    ? "running"
                    : m.status === "Cảnh báo"
                      ? "warning"
                      : "stopped"
                }>
                  {m.status}
                </td>
                <td>{m.power}%</td>
                <td>{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer className="footer">Dự án demo CNC – React + TypeScript</footer>
    </div>
  );
};

export default App;
