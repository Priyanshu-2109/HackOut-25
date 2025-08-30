import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { features } from "../assets/assets";
import { useModal } from "../context/ModalContext";
import {
  MapIcon,
  CpuChipIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const { openSignup } = useModal();

  const getIcon = (iconName) => {
    switch (iconName) {
      case "map":
        return <MapIcon className="h-12 w-12 text-blue-600" />;
      case "optimization":
        return <CpuChipIcon className="h-12 w-12 text-green-600" />;
      case "analytics":
        return <ChartBarIcon className="h-12 w-12 text-purple-600" />;
      case "sustainability":
        return <GlobeAltIcon className="h-12 w-12 text-emerald-600" />;
      default:
        return <MapIcon className="h-12 w-12 text-blue-600" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 overflow-hidden pt-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🌱 Sustainable Infrastructure Solutions
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Build Tomorrow's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Green Infrastructure
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-600 font-light max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform your business with intelligent infrastructure mapping,
            optimization, and sustainable energy solutions.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={openSignup}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center no-underline"
            >
              Start Free Trial
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="group border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 bg-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center">
              <PlayIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Why Choose GreenInfra?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Our comprehensive approach to renewable energy helps businesses
              reduce costs, improve efficiency, and achieve sustainability goals
              through innovative solutions.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed mb-4">
                  {feature.description}
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Professional Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600">
              Delivering measurable results across global infrastructure
              projects
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">
                Projects Delivered
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Across 25 countries
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">$2.8B</div>
              <div className="text-gray-600 font-medium">
                Infrastructure Value
              </div>
              <div className="text-sm text-gray-500 mt-1">Under management</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                15,000+
              </div>
              <div className="text-gray-600 font-medium">KM Pipeline</div>
              <div className="text-sm text-gray-500 mt-1">
                Optimized network
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                98%
              </div>
              <div className="text-gray-600 font-medium">
                Client Satisfaction
              </div>
              <div className="text-sm text-gray-500 mt-1">Industry leading</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your
              <span className="block text-green-200">Infrastructure?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-light">
              Join industry leaders who trust GreenInfra to optimize their
              infrastructure investments and drive sustainable growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <button
                onClick={openSignup}
                className="group bg-white text-green-600 hover:bg-gray-50 px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center shadow-xl"
              >
                Start Free Consultation
                <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group border-2 border-white/50 text-white hover:bg-white/10 px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300  backdrop-blur-3xl bg-transparent inline-flex items-center justify-center hover:border-white">
                <PlayIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                <span>Expert support included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
