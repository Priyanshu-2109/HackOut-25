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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Green Hydrogen
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Infrastructure
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Optimization
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-300 font-light max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Map, optimize, and scale green hydrogen infrastructure with
            AI-powered algorithms
          </motion.p>

          <motion.p
            className="text-lg mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Visualize existing facilities, optimize placement of new
            infrastructure, and make data-driven decisions for sustainable
            energy transition.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center no-underline"
            >
              Start Mapping
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <button className="group border-2 bg-gradient-to-r  border-white/30 text-black hover:bg-white/10 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm flex items-center">
              <PlayIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </button>
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
              Transform Green Hydrogen Infrastructure
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Our comprehensive platform provides end-to-end solutions for
              mapping, optimizing, and scaling green hydrogen infrastructure
              worldwide.
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Mapped Facilities</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Cost Reduction</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                12K+
              </div>
              <div className="text-gray-600">Pipeline KM</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                95%
              </div>
              <div className="text-gray-600">Efficiency Gain</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Optimize Your Infrastructure?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join the future of sustainable energy infrastructure with our
              AI-powered optimization platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openSignup}
                className="group bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center no-underline"
              >
                Get Started Today
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <Link
                to="/map"
                className="group border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center no-underline"
              >
                Explore Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
