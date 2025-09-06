'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="text-white py-20" style={{backgroundColor: '#2E7D32'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About EcoFinds
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Building a sustainable future through conscious commerce
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At EcoFinds, we believe that every item deserves a second chance. Our mission is to create a 
                sustainable marketplace where people can buy and sell pre-loved items, reducing waste and 
                promoting circular economy principles.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to making sustainable shopping accessible, affordable, and enjoyable for everyone 
                while helping reduce the environmental impact of consumer goods.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                  <div className="text-gray-600">Items Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">5K+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">2.5T</div>
                  <div className="text-gray-600">CO₂ Saved (kg)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at EcoFinds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{backgroundColor: '#E8F5E8'}}>
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                Every transaction on our platform contributes to a more sustainable future by extending product lifecycles.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{backgroundColor: '#FFF3E0'}}>
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We foster a trusted community where buyers and sellers can connect safely and build lasting relationships.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{backgroundColor: '#E3F2FD'}}>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">
                We prioritize security, transparency, and reliability in every interaction on our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-6">
                EcoFinds was born from a simple observation: too many perfectly good items end up in landfills 
                while people are looking for affordable, quality products. Founded in 2024, we set out to bridge 
                this gap by creating a platform that makes second-hand shopping as easy and trustworthy as buying new.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team of passionate environmentalists, technologists, and community builders work tirelessly 
                to improve the platform and support our growing community of eco-conscious users.
              </p>
              <p className="text-lg text-gray-600">
                Today, EcoFinds is more than just a marketplace – it's a movement towards conscious consumption 
                and environmental responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-white py-16" style={{backgroundColor: '#2E7D32'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Questions? We're Here to Help
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get in touch with our support team for any questions or assistance.
          </p>
          <a
            href="/help"
            className="px-8 py-4 rounded-lg font-semibold transition duration-200 inline-block text-lg hover:opacity-90"
            style={{backgroundColor: '#FF9800', color: 'white'}}
          >
            Visit Help Center
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
