import { RootLayout } from '@/components/layout/RootLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefinancePage() {
  return (
    <RootLayout>
      <div className="container py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Refinance</h1>
          <p className="text-muted-foreground">Refinance your positions for better rates</p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-xl text-muted-foreground">
                This page is under construction. Check back soon!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}
