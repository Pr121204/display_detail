const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb+srv://priyanshichaturvedi88:udd5c8RgpM7jb2Xr@cluster0.jnzm7hy.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define the Campaign schema
const campaignSchema = new mongoose.Schema({
  campaignName: String,
  campaignType: String,
  Email: String,
  OrgName: String,
  CampHeadName: String,
  ContactNo: String,
  VolunteerNeeded: Number,
  Address: String,
  StartDate: Date,
  EndDate: Date
  // Add more fields as per your requirements
});

// Create the Campaign model
const Campaign = mongoose.model('Campaign', campaignSchema);

// Create an Express application
const app = express();

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to handle user search for campaigns
app.get('/campaigns', async (req, res) => {
    const searchTerm = req.query.search;
  
    try {
      // Find campaigns that match the search term
      const campaigns = await Campaign.find({ campaignName: { $regex: searchTerm, $options: 'i' } });
  
      // Display the search results
      if (campaigns.length === 0) {
        res.send('<h1>No Results Found</h1>');
      } else {
        res.send(`
          <h1>Search Results</h1>
          <ul>
            ${campaigns.map(campaign => `<li><a href="/campaigns/${campaign._id}">${campaign.campaignName}</a></li>`).join('')}
          </ul>
        `);
      }
    } catch (err) {
      console.error('Error finding campaigns:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  // Define a route to display campaign details based on selection
  app.get('/campaigns/:id', async (req, res) => {
    const campaignId = req.params.id;
  
    try {
      // Find the campaign in the database
      const campaign = await Campaign.findById(campaignId);
  
      if (!campaign) {
        return res.status(404).send('Campaign not found');
      }
  
      // Display campaign details
      res.send(`
        <h1>${campaign.campaignName}</h1>
        <p>Type: ${campaign.campaignType}</p>
        <p>Email: ${campaign.Email}</p>
        <p>Organization: ${campaign.OrgName}</p>
        <p>Campaign Head: ${campaign.CampHeadName}</p>
        <p>Contact No: ${campaign.ContactNo}</p>
        <p>Volunteers Needed: ${campaign.VolunteerNeeded}</p>
        <p>Address: ${campaign.Address}</p>
        <p>Start Date: ${campaign.StartDate}</p>
        <p>End Date: ${campaign.EndDate}</p>
        <!-- Add more fields here -->
      `);
    } catch (err) {
      console.error('Error finding campaign:', err);
      res.status(500).send('Internal Server Error');
    }
  });  

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
