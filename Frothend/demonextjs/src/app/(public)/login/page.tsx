import { LoginForm } from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor:'#99CCCC',
      
    }}>
      <LoginForm />
    </div>
  );
}
