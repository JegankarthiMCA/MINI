import express from 'express';
import authMiddleware from '../authMiddleware.js';
import Vehicle from '../Model/Vehicle.js';
import Route from '../Model/Route.js';
import User from '../Model/User.js';

const router = express.Router();

// Add Vehicle
router.post('/vehicles', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error adding vehicle' });
  }
});

// Get all Vehicles (New Route)
router.get('/vehicles', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const vehicles = await Vehicle.find(); 
    res.status(200).json(vehicles); 
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vehicles' });
  }
});

// Add Route
router.post('/routes', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ error: 'Error adding route' });
  }
});

// Register Student and assign a bus
router.post('/register-student', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const { username, password, vehicleId } = req.body;
    const student = new User({ username, password, role: 'student', assignedBus: vehicleId });
    await student.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error registering student' });
  }
});

export default router;
