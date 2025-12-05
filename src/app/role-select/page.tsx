import { redirect } from 'next/navigation';

export default function RoleSelectPage() {
  redirect('/auth/login');
}
