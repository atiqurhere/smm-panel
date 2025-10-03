import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Clock,
  Users
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SMM Panel</span>
            </div>
            <p className="text-sm leading-relaxed">
              Professional SMM panel providing high-quality social media marketing services. 
              Trusted by 50,000+ customers worldwide with 99.9% success rate.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/instagram" className="text-sm hover:text-white transition-colors">
                  Instagram Services
                </Link>
              </li>
              <li>
                <Link href="/services/youtube" className="text-sm hover:text-white transition-colors">
                  YouTube Services
                </Link>
              </li>
              <li>
                <Link href="/services/facebook" className="text-sm hover:text-white transition-colors">
                  Facebook Services
                </Link>
              </li>
              <li>
                <Link href="/services/tiktok" className="text-sm hover:text-white transition-colors">
                  TikTok Services
                </Link>
              </li>
              <li>
                <Link href="/services/twitter" className="text-sm hover:text-white transition-colors">
                  Twitter Services
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm hover:text-white transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-sm hover:text-white transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-sm">
              Subscribe to get updates about new services and special offers.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full">Subscribe</Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@smmPanel.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-sm">50K+ Customers</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            <span className="text-sm">24/7 Support</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-400" />
            <span className="text-sm">Secure Payments</span>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <span>© {currentYear} SMM Panel. All rights reserved.</span>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/refunds" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>Powered by</span>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              <span className="font-semibold">NextJS & Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}