import { redirect } from 'next/navigation';

export default function AdminRoot() {
  // Automatically redirect the base URL to the dashboard layout
  redirect('/dashboard');
}
