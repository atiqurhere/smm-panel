import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter,
  MessageCircle,
  Linkedin,
  TrendingUp,
  Users,
  Heart,
  Eye,
  Share,
  Play
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ServicesPage() {
  const platforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      services: [
        { name: 'Followers', icon: Users, price: 'From $2.99' },
        { name: 'Likes', icon: Heart, price: 'From $1.99' },
        { name: 'Views', icon: Eye, price: 'From $0.99' },
        { name: 'Comments', icon: MessageCircle, price: 'From $3.99' }
      ]
    },
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-500',
      services: [
        { name: 'Subscribers', icon: Users, price: 'From $4.99' },
        { name: 'Views', icon: Play, price: 'From $1.49' },
        { name: 'Likes', icon: Heart, price: 'From $2.99' },
        { name: 'Comments', icon: MessageCircle, price: 'From $5.99' }
      ]
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      services: [
        { name: 'Page Likes', icon: Heart, price: 'From $3.99' },
        { name: 'Post Likes', icon: Heart, price: 'From $1.99' },
        { name: 'Shares', icon: Share, price: 'From $2.49' },
        { name: 'Comments', icon: MessageCircle, price: 'From $4.99' }
      ]
    },
    {
      name: 'TikTok',
      icon: MessageCircle,
      color: 'bg-black',
      services: [
        { name: 'Followers', icon: Users, price: 'From $3.49' },
        { name: 'Likes', icon: Heart, price: 'From $1.99' },
        { name: 'Views', icon: Eye, price: 'From $0.79' },
        { name: 'Shares', icon: Share, price: 'From $2.99' }
      ]
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      services: [
        { name: 'Followers', icon: Users, price: 'From $4.49' },
        { name: 'Likes', icon: Heart, price: 'From $2.49' },
        { name: 'Retweets', icon: Share, price: 'From $2.99' },
        { name: 'Views', icon: Eye, price: 'From $1.99' }
      ]
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      services: [
        { name: 'Connections', icon: Users, price: 'From $5.99' },
        { name: 'Post Likes', icon: Heart, price: 'From $3.49' },
        { name: 'Shares', icon: Share, price: 'From $4.99' },
        { name: 'Views', icon: Eye, price: 'From $2.99' }
      ]
    }
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'High Quality',
      description: 'Real and active users from targeted demographics'
    },
    {
      icon: Users,
      title: 'Fast Delivery',
      description: 'Most orders start within 30 minutes of placement'
    },
    {
      icon: Heart,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            🚀 Premium SMM Services
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Boost Your{' '}
            <span className="text-blue-600">Social Presence</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Professional social media marketing services for all major platforms. 
            Grow your audience, increase engagement, and build your brand.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Platform
            </h2>
            <p className="text-lg text-gray-600">
              We support all major social media platforms with high-quality services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <Card key={platform.name} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${platform.color}`}>
                      <platform.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-center">{platform.name}</CardTitle>
                  <CardDescription className="text-center">
                    Professional {platform.name.toLowerCase()} marketing services
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {platform.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <service.icon className="h-4 w-4 text-gray-600 mr-3" />
                          <span className="font-medium text-gray-900">{service.name}</span>
                        </div>
                        <Badge variant="outline">{service.price}</Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href="/auth/signup">
                      Order {platform.name} Services
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Grow Your Social Media?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have boosted their social media presence with our premium services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get Started Today
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}