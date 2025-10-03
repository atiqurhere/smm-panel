import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$10',
      period: 'month',
      description: 'Perfect for individuals getting started',
      features: [
        'Up to 10 orders per month',
        'Basic social media platforms',
        'Email support',
        'Standard delivery speed',
        'Basic analytics'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'month',
      description: 'Best for growing businesses',
      features: [
        'Up to 100 orders per month',
        'All social media platforms',
        'Priority email support',
        'Fast delivery speed',
        'Advanced analytics',
        'API access',
        'Custom targeting'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      description: 'For large businesses and agencies',
      features: [
        'Unlimited orders',
        'All platforms + premium services',
        '24/7 phone & email support',
        'Instant delivery',
        'Complete analytics suite',
        'Full API access',
        'White-label solution',
        'Dedicated account manager'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            💰 Simple, transparent pricing
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your{' '}
            <span className="text-blue-600">Perfect Plan</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Start free, scale up as you grow. No hidden fees, no setup costs. 
            Cancel or upgrade anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-lg text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/auth/signup">
                      {plan.name === 'Starter' ? 'Start Free' : 'Get Started'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer a free trial?
                </h3>
                <p className="text-gray-600">
                  Yes! Our Starter plan includes a free tier with limited orders to help you get started.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I upgrade or downgrade anytime?
                </h3>
                <p className="text-gray-600">
                  Absolutely! You can change your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, crypto payments, and Bangladesh mobile payments.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a setup fee?
                </h3>
                <p className="text-gray-600">
                  No setup fees, no hidden costs. You only pay for what you use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}