// Dashboard.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import InfoCard from '../InfoCard/InfoCard';
import NewsCard from '../NewsCard/NewsCard';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Fungsi untuk memformat angka menjadi Rupiah
const formatToRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value);
};

function Dashboard({ totalIncomes, totalExpenses }) {
  // Calculate the total financial data
  const total = totalIncomes + totalExpenses;

  // Function to reload the page
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
        <Col md={10} className="main-content main">
          <BreadcrumbAndProfile 
            username="Mr. Gerald" 
            role="Freelancer React Developer" 
            pageTitle="Dashboard"
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: true },
              { name: 'Welcome', path: '/welcome', active: true }
            ]}
          />

          {/* Row for the three buttons */}
          <Row className="mb-3">
            <Col md={4}>
              <Button onClick={handleReload} className="secondary-button w-50">
                <FontAwesomeIcon icon={faRotateRight} className="icon-left"/>Reload
              </Button>
            </Col>
          </Row>

          {/* Row for the Total, Incomes, and Expenses */}
          <Row className="mb-3">
            <Col md={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Initial state: transparent and slightly down
                animate={{ opacity: 1, y: 0 }} // Animate to: fully opaque and original position
                transition={{ duration: 0.5 }} // Animation duration: 0.5 seconds
              >
                <InfoCard 
                  title="Total" 
                  value={formatToRupiah(total)} 
                  linkText="View details" 
                  linkTo="/dashboard"
                />
              </motion.div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Start from slightly below and transparent
                animate={{ opacity: 1, y: 0 }} // Animate to fully visible and original position
                transition={{ duration: 0.5, delay: 0.2 }} // Delay the animation of the first card
              >
                <InfoCard
                  title="Incomes"
                  value={formatToRupiah(totalIncomes)}
                  linkText="Add or manage your Income"
                  linkTo="/incomes"
                />
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Start from slightly below and transparent
                animate={{ opacity: 1, y: 0 }} // Animate to fully visible and original position
                transition={{ duration: 0.5, delay: 0.4 }} // Delay the animation of the second card a bit more
              >
                <InfoCard
                  title="Expenses"
                  value={formatToRupiah(totalExpenses)}
                  linkText="Add or manage your expenses"
                  linkTo="/expenses"
                />
              </motion.div>
            </Col>
          </Row>

          {/* Section for Chart Statistical */}

        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
