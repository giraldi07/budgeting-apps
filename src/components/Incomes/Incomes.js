import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import * as XLSX from 'xlsx';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faArrowCircleLeft, faArrowCircleRight, faPlusCircle, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

// Helper function to format amount to Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

function Incomes() {
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem('incomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [incomesPerPage] = useState(5);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Coffee Sales', 'Tea Sales', 'Pastry and Bakery Sales', 'Food Sales', 'Beverage Sales', 
    'Merchandise Sales', 'Specialty Items', 'Catering and Events', 'Loyalty Program Income', 
    'Delivery and Takeout', 'Rental Income', 'Franchise Fees'
  ];

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incomes');
    XLSX.writeFile(wb, 'Incomes.xlsx');
  };

  const handleEdit = (income) => {
    setEditing(true);
    setCurrentIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setDate(income.date);
    setDescription(income.description);
    setIsPaid(income.status === 'PAID');
    setCategory(income.category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount || !date || !description || !category) {
      alert('All fields are required.');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Amount must be a positive number.');
      return;
    }

    const isConfirmed = window.confirm(editing ? 'Are you sure you want to update this income?' : 'Are you sure you want to add this income?');
    if (!isConfirmed) return;

    const incomeData = {
      id: editing ? currentIncome.id : Date.now(),
      name,
      amount: parseFloat(amount),
      date,
      description,
      status: isPaid ? 'PAID' : 'DUE',
      category,
    };

    setIncomes(editing ? incomes.map(income => income.id === currentIncome.id ? incomeData : income) : [...incomes, incomeData]);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate('');
    setDescription('');
    setIsPaid(false);
    setEditing(false);
    setCurrentIncome(null);
    setCategory('');
  };

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this income?')) {
      setIncomes(incomes.filter(income => income.id !== id));
    }
  };

  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);

  const filteredIncomes = searchQuery
    ? incomes.filter(income =>
        income.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (income.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    : incomes;

  const indexOfLastIncome = currentPage * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
  const currentIncomes = filteredIncomes.slice(indexOfFirstIncome, indexOfLastIncome);

  const handlePreviousPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  const handleNextPage = () => setCurrentPage(prev => (prev * incomesPerPage < filteredIncomes.length ? prev + 1 : prev));

  const chartData = {
    labels: incomes.map(income => new Date(income.date)),
    datasets: [{
      label: 'Total Income',
      data: incomes.map(income => income.amount),
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Income (Rp)',
        },
      },
    },
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
        <Col md={10} className="main">
          <BreadcrumbAndProfile 
            username="Mr. Gerald" 
            role="Freelancer React Developer" 
            pageTitle="Incomes"
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: false },
              { name: 'Incomes', path: '/incomes', active: true }
            ]}
          />
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search incomes..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Row>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="mt-3 total">
                  <Card.Body>
                    <Card.Title>Total Income</Card.Title>
                    <Card.Text>
                      Total: {formatRupiah(totalIncome)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={6}>
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </Col>
          </Row>
          <Form onSubmit={handleSubmit}>
            <Row className="grid-row">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Income Name" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Income Amount in Rupiah" required />
                </Form.Group>
              </Col>
            </Row>
            <Row className="grid-row">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Check 
                    type="checkbox" 
                    label="Paid" 
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)} 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="mt-3">
              {editing ? 'Update Income' : 'Add Income'}
            </Button>
          </Form>
          <ListGroup className="mt-3">
            {currentIncomes.map((income) => (
              <ListGroup.Item key={income.id}>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{income.name}</h5>
                    <p>{income.description}</p>
                    <p>{formatRupiah(income.amount)}</p>
                    <p>Date: {new Date(income.date).toLocaleDateString()}</p>
                    <p>Category: {income.category}</p>
                    <p>Status: {income.status}</p>
                  </div>
                  <div>
                    <Button variant="outline-primary" onClick={() => handleEdit(income)}>
                      <FontAwesomeIcon icon={faPenToSquare} /> Edit
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleRemove(income.id)} className="ms-2">
                      <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="pagination mt-3">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Previous
            </Button>
            <Button onClick={handleNextPage} disabled={currentPage * incomesPerPage >= filteredIncomes.length} className="ms-2">
              <FontAwesomeIcon icon={faArrowCircleRight} /> Next
            </Button>
            <Button onClick={exportToExcel} variant="outline-success" className="ms-2">
              <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Incomes;
