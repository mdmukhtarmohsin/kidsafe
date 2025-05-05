"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Star,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import ScrollContext from "@/components/SmoothScrollContext";

// Helper component for icons (replace with actual SVGs or an icon library)
// Removed IconPlaceholder component

// Removed CubeIcon component

// Removed StarIcon component

export default function KidSafeLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // For Safety/Management tabs

  const tabs = ["Safety", "Management"];

  return (
    <ScrollContext>
      <div className="flex w-full flex-col min-h-screen bg-[#fdfdfd] text-black font-mono selection:bg-black selection:text-white ">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutralGray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-black">
              KidSafe
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="#"
                className="text-sm text-neutralMid hover:text-black"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-sm text-neutralMid hover:text-black"
              >
                Features
              </Link>
              <div className="relative group">
                <button className="text-sm text-neutralMid hover:text-black flex items-center">
                  Pricing
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {/* Add dropdown menu here if needed */}
              </div>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="#"
                className="hidden md:inline-block text-sm text-neutralMid hover:text-black"
              >
                Sign In
              </Link>
              <button className="hidden md:inline-block bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-neutralDark transition-colors">
                Menu
              </button>
              <button
                className="md:hidden text-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-neutralGray">
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                <Link
                  href="#"
                  className="text-sm text-neutralMid hover:text-black"
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="text-sm text-neutralMid hover:text-black"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="text-sm text-neutralMid hover:text-black"
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="text-sm text-neutralMid hover:text-black"
                >
                  Sign In
                </Link>
                <button className="w-full bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-neutralDark transition-colors mt-2">
                  Menu
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-neutralLight py-16 md:py-24 md:px-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#FCFCF5] p-8 md:p-12 rounded-2xl border border-black shadow-sm ">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="flex flex-col space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black">
                      Empower Your Family with KidSafe
                    </h1>
                    <p className="text-neutralMid text-base md:text-lg leading-relaxed">
                      In today's digital age, ensuring your child's safe and
                      healthy screen time is crucial. KidSafe provides parents
                      with the tools to monitor usage, set limits, and foster
                      responsible device habits.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <button className="bg-black text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-neutralDark transition-colors">
                        Learn More
                      </button>
                      <button className="border border-black text-black px-7 py-3 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors">
                        Sign Up
                      </button>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-w-4 aspect-h-3 md:aspect-w-16 md:aspect-h-10">
                    <Image
                      src="/img1.png" // Replace with actual image path
                      alt="Woman looking thoughtfully"
                      width={600}
                      height={450}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section 1 */}
          <section className="bg-[#FCFCF5] py-16 md:py-24 md:px-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-w-4 aspect-h-3 md:aspect-w-16 md:aspect-h-10 order-2 md:order-1">
                  <Image
                    src="/img3.png"
                    alt="Child using a tablet on a couch"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-6 order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight text-black">
                    Empower Your Parenting with Comprehensive Screen Time
                    Management Features
                  </h2>
                  <p className="text-neutralMid text-base md:text-lg leading-relaxed">
                    KidSafe offers robust tools for parents to monitor and
                    manage their children's device usage. With features like
                    profile setup and usage alerts, you can ensure a balanced
                    digital experience.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="flex items-start space-x-3">
                      <Box
                        className="w-8 h-8 text-neutralDark mt-1 flex-shrink-0"
                        strokeWidth={1.5}
                      />
                      <div>
                        <h3 className="font-semibold text-black mb-1">
                          Profile setup
                        </h3>
                        <p className="text-sm text-neutralMid">
                          Easily create profiles for each child with
                          personalized settings and restrictions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Box
                        className="w-8 h-8 text-neutralDark mt-1 flex-shrink-0"
                        strokeWidth={1.5}
                      />
                      <div>
                        <h3 className="font-semibold text-black mb-1">
                          Content Rules
                        </h3>
                        <p className="text-sm text-neutralMid">
                          Set daily limits or block inappropriate websites or
                          app categories effortlessly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section 2 */}
          <section className="bg-white container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center md:px-8">
            <p className="text-sm text-neutralMid uppercase tracking-wider mb-2">
              Key Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-black max-w-3xl mx-auto mb-6">
              Gain Insight and Control Over Digital Habits
            </h2>
            <p className="text-neutralMid text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              KidSafe provides a clear view of your child's device activity.
              Understand usage patterns, filter content effectively, and
              schedule screen time to promote a healthy balance between the
              digital and real world.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center">
              {/* Left Features */}
              <div className="flex flex-col gap-8 text-left md:text-right">
                <div className="flex md:flex-col items-center space-x-3  md:space-x-3">
                  <Box
                    className="w-8 h-8 text-black mt-1 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-black mb-1 text-center">
                      Usage Monitoring
                    </h3>
                    <p className="text-sm text-neutralMid text-center">
                      Track app usage, website visits, and overall screen time
                      duration per profile.
                    </p>
                  </div>
                </div>
                <div className="flex md:flex-col items-center space-x-3 md:space-x-3">
                  <Box
                    className="w-8 h-8 text-black mt-1 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-black mb-1 text-center">
                      Advanced Filtering
                    </h3>
                    <p className="text-sm text-neutralMid text-center">
                      Block specific apps, websites, or categories to create a
                      safer online environment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Center Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg  max-w-sm mx-auto my-8 md:my-0 order-first md:order-none">
                <Image
                  src="/img4.jpg" // Replace with actual image path
                  alt="Person working at a desk"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Features */}
              <div className="flex flex-col gap-8 text-left">
                <div className="flex md:flex-col items-center space-x-3">
                  <Box
                    className="w-8 h-8 text-black mt-1 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-semibold text-black mb-1 text-center">
                      Time Scheduling
                    </h3>
                    <p className="text-sm text-neutralMid text-center">
                      Set specific times for device access, like homework hours
                      or bedtime routines.
                    </p>
                  </div>
                </div>
                <div className="flex md:flex-col items-center space-x-3">
                  <Box
                    className="w-8 h-8 text-black mt-1 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-semibold text-black mb-1 text-center">
                      Activity Reports
                    </h3>
                    <p className="text-sm text-neutralMid text-center">
                      Receive regular summaries of your child's digital activity
                      directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 flex justify-center gap-4">
              <button className="border border-neutralGray text-black px-7 py-3 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors">
                Learn More
              </button>
              <button className="bg-black text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-neutralDark transition-colors flex items-center">
                Sign Up
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </section>

          {/* Safety/Management Section */}
          <section className="bg-[#FCF7FC] py-16 md:py-24 md:px-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col space-y-6">
                  <p className="text-sm text-neutralMid uppercase tracking-wider">
                    Empower
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight text-black">
                    Secure Your Child's Digital Experience Today
                  </h2>
                  <p className="text-neutralMid text-base md:text-lg leading-relaxed">
                    KidSafe provides parents with the tools to ensure their
                    children's online safety. With features like screen time
                    management and app monitoring, you can enjoy peace of mind.
                  </p>

                  {/* Tabs */}
                  <div className="border-b border-black/20">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {tabs.map((tab, index) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(index)}
                          className={`${
                            activeTab === index
                              ? "border-black text-black"
                              : "border-transparent text-neutralMid hover:text-black hover:border-black/30"
                          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-150`}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="pt-6 min-h-[80px]">
                    {activeTab === 0 && (
                      <div>
                        <p className="text-sm text-neutralMid">
                          Protect your children from inappropriate content.
                        </p>
                        <Link
                          href="#"
                          className="text-sm font-medium text-black mt-2 inline-block hover:underline"
                        >
                          Learn More →
                        </Link>
                      </div>
                    )}
                    {activeTab === 1 && (
                      <div>
                        <p className="text-sm text-neutralMid">
                          Easily set limits on screen time.
                        </p>
                        <Link
                          href="#"
                          className="text-sm font-medium text-black mt-2 inline-block hover:underline"
                        >
                          Learn More →
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button className="border border-black text-black px-7 py-3 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors">
                      Learn More
                    </button>
                    <button className="bg-black text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-neutralDark transition-colors flex items-center">
                      Sign Up
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-w-4 aspect-h-3 md:aspect-w-16 md:aspect-h-10">
                  <Image
                    src="/img2.png" // Replace with actual image path
                    alt="Person working at a desk"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="bg-[#FDFDFA] py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-goldStar fill-current"
                  />
                ))}
              </div>
              <p className="text-xl md:text-2xl italic mb-6 text-black leading-relaxed">
                "KidSafe has transformed the way I manage my children's screen
                time. I feel more in control and confident about their online
                safety!"
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Image
                  src="/img3.png" // Replace with actual image path
                  alt="Emily Johnson"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm text-black">
                    Emily Johnson
                  </p>
                  <p className="text-xs text-neutralMid">
                    Parent of 2, Teacher
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-[#FDFDFA] py-16 md:py-24 md:px-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                    Frequently asked questions
                  </h2>
                  <p className="text-neutralMid mb-8">
                    Find answers to your most pressing questions about KidSafe's
                    features and functionality.
                  </p>
                  <button className="border border-black text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors">
                    Contact us
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-10 gap-y-10 md:px-12">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">
                      How to set up?
                    </h3>
                    <p className="text-neutralMid text-sm leading-relaxed">
                      To set up KidSafe, download the app and create a parent
                      account. Then, add your child's profile by entering their
                      name and device ID. Finally, configure the time limits and
                      content restrictions according to your preferences.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">
                      What is usage monitoring?
                    </h3>
                    <p className="text-neutralMid text-sm leading-relaxed">
                      Usage monitoring allows parents to track their child's
                      online activity, including websites visited and apps used.
                      This feature provides insights into screen time habits and
                      helps enforce healthy usage. Parents can view detailed
                      logs and receive alerts when limits are reached.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">
                      How to block websites?
                    </h3>
                    <p className="text-neutralMid text-sm leading-relaxed">
                      To block websites, access the settings in your parent
                      account and navigate to the content rules section. Here,
                      you can add specific URLs or categories to the blocklist.
                      Changes take effect immediately, ensuring your child is
                      protected.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">
                      What if limits are reached?
                    </h3>
                    <p className="text-neutralMid text-sm leading-relaxed">
                      When screen time limits are reached, both the parent and
                      child will receive notifications. The device can be
                      temporarily locked to prevent further usage. Parents can
                      adjust limits as needed through their account.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">
                      Can I edit profiles?
                    </h3>
                    <p className="text-neutralMid text-sm leading-relaxed">
                      Yes, you can edit child profiles at any time. Simply log
                      into your parent account, select the child's profile, and
                      make the necessary changes. This includes updating names,
                      device IDs, and screen time limits.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">
                      Is there a free trial?
                    </h3>
                    <p className="text-neutralMid text-sm leading-relaxed">
                      Yes, we offer a free trial period so you can experience
                      all the features before committing. Sign up today to get
                      started and explore the benefits of KidSafe for your
                      family's digital well-being.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-[#FDFDFA] py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                Experience KidSafe Today!
              </h2>
              <p className="text-neutralMid text-base md:text-lg leading-relaxed mb-8">
                Sign up now for a free trial and take control of your child's
                screen time.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-black text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-neutralDark transition-colors">
                  Sign Up
                </button>
                <button className="border border-black text-black px-7 py-3 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* Newsletter Signup Section */}
          <section className="bg-[#FDFDFA] container mx-auto px-4 sm:px-6 lg:px-14 py-16 md:py-24 ">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                  Stay Updated on Child Safety
                </h2>
                <p className="text-neutralMid text-base md:text-lg leading-relaxed">
                  Subscribe to our newsletter for expert tips and the latest
                  news on child safety and screen time management. Empower your
                  family with the knowledge to navigate the digital world
                  safely.
                </p>
              </div>
              <div>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="flex-grow px-4 py-3 border border-neutralGray rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-neutralLight text-black placeholder-neutralMid"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutralDark transition-colors flex-shrink-0"
                  >
                    Sign Up
                  </button>
                </form>
                <p className="text-xs text-neutralMid mt-3">
                  By signing up you agree with our Terms and conditions.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#606052] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 pb-12 border-b border-neutralMid/30">
              <div className="flex items-start space-x-4">
                <Mail
                  className="h-6 w-6 text-white mt-1 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-sm text-white">
                    Have questions or need support? We're here to help!
                  </p>
                  <a
                    href="mailto:hello@relume.io"
                    className="text-sm text-white hover:underline"
                  >
                    hello@relume.io
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone
                  className="h-6 w-6 text-white mt-1 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h4 className="text-white font-semibold mb-1">Phone</h4>
                  <p className="text-sm text-white">
                    Reach us anytime for assistance or inquiries.
                  </p>
                  <a
                    href="tel:+15551234567"
                    className="text-sm text-white hover:underline"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin
                  className="h-6 w-6 text-white mt-1 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h4 className="text-white font-semibold mb-1">Office</h4>
                  <p className="text-sm text-white">
                    Visit us for any in-person support or consultations.
                  </p>
                  <p className="text-sm text-white">
                    456 Parent Lane, Sydney NSW 2000 AU
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Links & Subscribe */}
            <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-8 mb-16">
              <div className="col-span-2 md:col-span-1">
                <Link
                  href="/"
                  className="text-2xl font-bold text-white mb-4 block"
                >
                  KidSafe
                </Link>
                <p className="text-sm text-white mb-3">Subscribe to updates</p>
                <p className="text-xs text-white mb-3">
                  Stay informed about our latest features and tips.
                </p>
                <form className="flex mb-2">
                  <input
                    type="email"
                    placeholder="Your email here"
                    required
                    className="flex-grow px-3 py-2 border-none rounded-l-md text-sm bg-[#595753] text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="bg-[#595753] text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-[#6a6864] transition-colors border-l border-neutralDark/50"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-xs text-white">
                  By subscribing, you agree to our{" "}
                  <Link href="#" className="underline hover:text-white">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Home Page
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Features Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Pricing Plans
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Support Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Blog Posts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      User Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Community Forum
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Webinars
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Company Info</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Press Releases
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-semibold text-white mb-4">
                  Stay Connected
                </h4>
                <ul className="space-y-2 mb-6">
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Facebook Page
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Twitter Feed
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      Instagram Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      LinkedIn Page
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-white"
                    >
                      YouTube Channel
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-neutralMid/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
              <div className="mb-4 md:mb-0 text-center md:text-left text-white">
                <span>
                  © {new Date().getFullYear()} KidSafe. All rights reserved.
                </span>
                <Link href="#" className="ml-4 text-white hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="#" className="ml-4 text-white hover:text-white">
                  Terms of Service
                </Link>
                <Link href="#" className="ml-4 text-white hover:text-white">
                  Cookies Settings
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="text-white hover:text-white"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="text-white hover:text-white"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  aria-label="X (Twitter)"
                  className="text-white hover:text-white"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  aria-label="LinkedIn"
                  className="text-white hover:text-white"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  aria-label="Youtube"
                  className="text-white hover:text-white"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ScrollContext>
  );
}
