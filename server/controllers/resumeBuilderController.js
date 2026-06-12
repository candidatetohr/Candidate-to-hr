import { buildResumeFromDetails } from '../services/nvidiaAI.js';

export const generateResume = async (req, res) => {
  try {
    const { rawDetails } = req.body;
    
    if (!rawDetails || rawDetails.length < 20) {
      return res.status(400).json({ success: false, message: 'Please provide more details.' });
    }

    const name = req.user?.name || 'Your Name';
    const email = req.user?.email || 'your.email@example.com';

    const generatedResumeJSON = await buildResumeFromDetails(rawDetails, name, email);

    res.status(200).json({
      success: true,
      data: generatedResumeJSON
    });
  } catch (error) {
    console.error('Resume Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
