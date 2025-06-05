import React, { useState, useEffect } from 'react';
import "../assets/css/shifts.css";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Form,
  Button,
  Modal,
} from 'react-bootstrap';
import axios from 'axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  return daysOfWeek[date.getDay() - 1];
};

const Shifts = () => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [searchTerm, setSearchTerm] = useState('');
  const [schedule, setSchedule] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    const fetchSchedule = async () => {
     try {
  const res = await fetch('http://localhost:4000/shift/get-daily-schedule'); // Replace with your API
  if (!res.ok) throw new Error('Network response was not ok');

  const data = await res.json();
  const apiSchedule = data.schedule;

  const formatted = {};
  for (let dayData of apiSchedule) {
    const dayName = getDayName(dayData.date);
    if (!dayName) continue;

    const morning = [];
    const afternoon = [];

    dayData.shifts.forEach((shift) => {
      const entry = {
        name: shift.marshall.name,
        supervisor: shift.supervisor.name,
        code: shift.streetCode,
        shiftType: shift.shiftType.toLowerCase()
      };

      if (entry.shiftType === 'morning') morning.push(entry);
      else if (entry.shiftType === 'afternoon') afternoon.push(entry);
    });

    formatted[dayName] = { morning, afternoon };
  }

  daysOfWeek.forEach(day => {
    if (!formatted[day]) formatted[day] = { morning: [], afternoon: [] };
  });

  setSchedule(formatted);
} catch (err) {
  console.error('Failed to fetch schedule:', err);
}

    };

    fetchSchedule();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCardClick = (entry) => {
    setModalData(entry);
    setShowModal(true);
  };

  const exportToCSV = () => {
    const current = schedule[activeDay] || { morning: [], afternoon: [] };
    const rows = [['Name', 'Shift', 'Hours', 'Street Code', 'Supervisor']];

    const formatRow = (entry, hours) => [
      entry.name,
      entry.shiftType.charAt(0).toUpperCase() + entry.shiftType.slice(1),
      hours,
      entry.code,
      entry.supervisor,
    ];

    current.morning.forEach((e) => rows.push(formatRow(e, '7:00 – 15:00')));
    current.afternoon.forEach((e) => rows.push(formatRow(e, '10:00 – 18:00')));

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeDay}_shift_schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCards = (shiftType, shiftData) => {
    const hours = shiftType === 'morning' ? '06:30 - 15:30' : '09:00 - 18:00';
    const variant = shiftType === 'morning' ? 'danger' : 'primary';

    return shiftData
      .filter((entry) => entry.name.toLowerCase().includes(searchTerm))
      .map((entry, idx) => (
        <Col key={`${entry.name}-${idx}`} xs={12} sm={6} md={4} lg={3} className="mb-3">
          <Card
            border={variant}
            onClick={() => handleCardClick({ ...entry, hours, shift: shiftType })}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>{entry.name}</Card.Title>
              <Card.Text>
                <strong>Shift:</strong> {shiftType.charAt(0).toUpperCase() + shiftType.slice(1)}
                <br />
                <strong>Hours:</strong> {hours}
                <br />
                <strong>Street Code:</strong> {entry.code}
                <br />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ));
  };

  const currentSchedule = schedule[activeDay] || { morning: [], afternoon: [] };
  async function handleShiftGeneration() {
  try {
    const res = await fetch('http://localhost:4000/shift/generate-weekly',{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            //  Authorization: `${serverToken}`,
            //  'x-access-token': `${tokenHeader}`
            },
            
          });
          const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    

    alert('Schedule generated successfully.');
    setTimeout(() => {
  window.location.reload();
}, 500);
  } catch (error) {
    alert(error);
  }
}

  return (
    <Container className="p-4">
      <Tabs
        id="day-tabs"
        activeKey={activeDay}
        onSelect={(k) => setActiveDay(k)}
        className="mb-3 justify-content-center"
      >
        {daysOfWeek.map((day) => (
          <Tab eventKey={day} title={day} key={day} />
        ))}
      </Tabs>

      <div className="text-center mb-3">
        <strong>
          Morning: {currentSchedule.morning.length} | Afternoon: {currentSchedule.afternoon.length} | Total:{' '}
          {currentSchedule.morning.length + currentSchedule.afternoon.length}
        </strong>
      </div>

      <Form className="d-flex justify-content-center mb-3 flex-wrap">
        <Button variant="danger" className="me-2 mb-2" onClick={() => window.print()}>
          Print / Export PDF
        </Button>
        <Button variant="warning" className="ms-2 mb-2" onClick={() => handleShiftGeneration()}>
          Generate shift
        </Button>
      </Form>

      <Row>
        {renderCards('morning', currentSchedule.morning)}
        {renderCards('afternoon', currentSchedule.afternoon)}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton className="bg-white border-bottom">
    <Modal.Title className="fw-semibold text-dark">{modalData.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body className="bg-white">
    <p className="mb-2">
      <strong className="text-muted">Shift:</strong> {modalData.shift}
    </p>
    <p className="mb-2">
      <strong className="text-muted">Hours:</strong> {modalData.hours}
    </p>
    <p className="mb-2">
      <strong className="text-muted">Street Code:</strong> {modalData.code}
    </p>
  </Modal.Body>
  <Modal.Footer className="bg-white border-top">
    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </Container>
  );
};

export default Shifts;
