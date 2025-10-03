import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Clock, 
  Shield, 
  Zap,
  Instagram,
  Facebook,
  Youtube,
  Music,
  MessageCircle,
  Linkedin,
  TrendingUp,
  DollarSign,
  Globe,
  Award
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function HomePage() {
  const services = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      services: ['Followers', 'Likes', 'Views', 'Comments'],
      startPrice: '$1.99'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-500',
      services: ['Subscribers', 'Views', 'Likes', 'Watch Time'],
      startPrice: '$2.99'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      services: ['Page Likes', 'Post Likes', 'Shares', 'Comments'],
      startPrice: '$2.49'
    },
    {
      name: 'TikTok',
      icon: MessageCircle,
      color: 'bg-black',
      services: ['Followers', 'Likes', 'Views', 'Shares'],
      startPrice: '$1.79'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Delivery',
      description: 'Most orders start within 30 minutes'
    },
    {
      icon: Shield,
      title: '100% Safe & Secure',
      description: 'Your accounts are completely protected'
    },
    {
      icon: Users,
      title: 'Real Active Users',
      description: 'High-quality engagement from real people'
    },
    {
      icon: Clock,
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance when you need it'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Instagram Influencer',
      content: 'This SMM panel helped me grow from 5K to 100K followers in just 3 months. The quality is amazing!',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'YouTube Creator',
      content: 'Best investment for my channel! The views and subscribers are real and engage with my content.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Davis',
      role: 'Business Owner',
      content: 'Boosted our brand awareness significantly. Customer support is excellent and delivery is fast.',
      rating: 5,
      avatar: '👩‍🚀'
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            🚀 #1 SMM Panel - Trusted by 50,000+ customers worldwide
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Grow Your Social Media{' '}
            <span className="text-blue-600">Like Never Before</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The world&apos;s most trusted SMM panel. Get real followers, likes, views and engagement 
            for Instagram, YouTube, Facebook, TikTok and 25+ platforms. Start from just $0.01!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/auth/signup">
                Start Growing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3" asChild>
              <Link href="/services">
                Browse Services
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2.5M+</div>
              <div className="text-sm text-gray-600">Orders Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Live Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$0.01</div>
              <div className="text-sm text-gray-600">Starting Price</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Most Popular SMM Services
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our wide range of social media marketing services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={service.name} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${service.color} mb-4 mx-auto`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>Starting from {service.startPrice}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/services">
                      View {service.name} Services
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our SMM Panel?
            </h2>
            <p className="text-lg text-gray-600">
              We provide the highest quality social media marketing services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Thousands of satisfied customers trust our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Social Media?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join over 50,000 customers who have grown their social media presence with us. 
            Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3" asChild>
              <Link href="/auth/signup">
                Create Free Account
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/how-it-works">
                How It Works
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}