import { RootLayout } from '@/components/layout/RootLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NotificationTest } from '@/components/test/notification-test';
import { ErrorTest } from '@/components/test/error-test';
import Link from 'next/link';

export default function Home() {
  return (
    <RootLayout>
      <section className="py-24">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Modern DeFi Liquidity Management Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl">
              Narval provides efficient and transparent vault and recursive lending solutions for
              DeFi users.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">Learn More</Link>
              </Button>
            </div>
            
            <div className="mt-8 w-full">
              <div className="mb-8">
                <NotificationTest />
              </div>
              <div>
                <ErrorTest />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Efficient Vaults</CardTitle>
                <CardDescription>Optimized liquidity management solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our vault system provides the best capital efficiency and risk management through
                  recursive lending strategies.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/vaults">Explore Vaults</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diverse Strategies</CardTitle>
                <CardDescription>Adaptable to different market conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Choose from multiple lending strategies, adjustable based on your risk preferences
                  and market outlook.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/strategies">View Strategies</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>Comprehensive data insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access real-time data analysis and transparent reporting through our dashboard to
                  understand your recursive lending performance.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
