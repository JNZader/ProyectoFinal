import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Bienvenido a Ecommerce</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-lg">Explora nuestro catálogo y encuentra los mejores productos.</p>
                    <Button asChild>
                        <a href="/catalogo">Ver Catálogo</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}