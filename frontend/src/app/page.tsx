import { redirect } from 'next/navigation';

// The root route redirects to the main dashboard view.
export default function RootPage() {
  redirect('/assignments');
}
