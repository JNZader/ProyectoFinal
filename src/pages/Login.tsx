import { SignIn } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <SignIn redirectUrl="/home" />
        </CardContent>
      </Card>
    </div>
  );
}