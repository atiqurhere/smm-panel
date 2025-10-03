import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  UserPlus, 
  CreditCard, 
  ShoppingCart, 
  Zap,
  CheckCircle,
  Clock,
  Shield,
  HeadphonesIcon
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up for free in under 60 seconds. No credit card required to get started.',
      details: [
        'Quick email verification',
        'Secure profile setup', 
        'Choose your preferences'
      ]
    },
    {
      step: 2,
      icon: CreditCard,
      title: 'Add Funds',
      description: 'Recharge your wallet with our secure payment methods. Multiple options available.',
      details: [
        'Credit/debit cards accepted',
        'PayPal and crypto payments',
        'Bangladesh mobile payments'
      ]
    },
    {
      step: 3,
      icon: ShoppingCart,
      title: 'Place Your Order',
      description: 'Select services, enter your social media links, and place your order.',
      details: [
        'Browse 1000+ services',
        'Instant order processing',
        'Real-time tracking'
      ]
    },
    {
      step: 4,
      icon: Zap,
      title: 'Watch Your Growth',
      description: 'Sit back and watch your social media accounts grow with high-quality engagement.',
      details: [
        'Fast delivery guaranteed',
        'Real, active users',
        '24/7 monitoring'
      ]
    }
  ]

  const features = [
    {
      icon: CheckCircle,
      title: 'High Quality Services',
      description: 'All our services use real, active users - no bots or fake accounts.'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Most orders start within 30 minutes and complete within 24-72 hours.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your accounts are 100% safe. We never ask for passwords.'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Our friendly support team is available around the clock to help.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            📈 Simple Process
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How It{' '}
            <span className="text-blue-600">Works</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Growing your social media presence has never been easier. 
            Follow these simple steps to boost your online visibility.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, index) => (
              <Card key={step.step} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                        <step.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our SMM Panel?
            </h2>
            <p className="text-lg text-gray-600">
              We provide the most reliable and effective social media marketing services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center p-8">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Join thousands of satisfied customers and start growing your social media presence today.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/signup">
                    Create Free Account
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/services">
                    Browse Services
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}