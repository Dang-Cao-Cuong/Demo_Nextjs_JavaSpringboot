export default function MachinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: 0,
      margin: 0
    }}>
      {children}
    </div>
  );
}
