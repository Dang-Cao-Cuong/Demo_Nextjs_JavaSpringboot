import { RegisterForm } from '@/components/forms/register-form';

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: '#99CCCC',
    }}>
      <RegisterForm />
    </div>
  );
}
